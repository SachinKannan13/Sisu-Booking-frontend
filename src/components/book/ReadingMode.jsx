/**
 * ReadingMode — Kindle-grade reading surface (Phase 2 rebuild)
 *
 * Features:
 *  • Reflowed continuous prose — no visible chunk boundaries
 *  • Serif (Lora) or sans reading font; 4 size levels + line-height control
 *  • Themes: Light, Sepia, Night — persisted to localStorage
 *  • Selection toolbar: Highlight (4 colours), Bookmark, Ask AI
 *  • Bookmarks panel — jump, label, delete; persisted via progress API
 *  • Highlights panel — jump, list, colour-coded
 *  • Chapter contents drawer
 *  • Page X / Y + % + estimated time; resumes to saved position
 *  • Keyboard: ←/→ pages, B bookmark, T theme cycle
 *  • Mobile tap zones + swipe-to-turn
 *  • Respects prefers-reduced-motion
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Menu, Bookmark, BookmarkCheck,
  Highlighter, MessageSquarePlus, X, Settings, Sun, Coffee, Moon,
} from 'lucide-react';
import { useBook } from '../../hooks/useBook.js';
import ChapterNav from './ChapterNav.jsx';
import { SpinnerOverlay } from '../ui/LoadingScreen.jsx';
import toast from 'react-hot-toast';

// ── Constants ──────────────────────────────────────────────────────────
const FONT_SIZES   = { small: '16px', medium: '18px', large: '21px', xl: '24px' };
const LINE_HEIGHTS = { compact: '1.6', normal: '1.75', relaxed: '1.95' };
const WORDS_PER_MIN = 200;
const THEMES = ['light', 'sepia', 'night'];
const THEME_ICONS = { light: Sun, sepia: Coffee, night: Moon };
const HIGHLIGHT_COLORS = [
  { id: 'amber', hex: '#f5a623' },
  { id: 'blue',  hex: '#3b82f6' },
  { id: 'green', hex: '#16a34a' },
  { id: 'pink',  hex: '#db2777' },
];

function getStoredPref(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? v : fallback; } catch { return fallback; }
}
function storePref(key, val) { try { localStorage.setItem(key, val); } catch {} }

// ── Selection toolbar ──────────────────────────────────────────────────
function SelectionToolbar({ pos, onHighlight, onBookmark, onAskAI, onDismiss }) {
  if (!pos) return null;
  return (
    <div
      className="reader-toolbar"
      style={{ top: pos.y, left: pos.x }}
      onMouseDown={e => e.preventDefault()}
    >
      {HIGHLIGHT_COLORS.map(c => (
        <button
          key={c.id}
          title={`Highlight ${c.id}`}
          onClick={() => { onHighlight(c.id); onDismiss(); }}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: c.hex, border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            cursor: 'pointer', margin: '0 2px', flexShrink: 0,
          }}
        />
      ))}
      <div className="toolbar-divider" />
      <button title="Bookmark this passage (B)" onClick={() => { onBookmark(); onDismiss(); }}>
        <Bookmark size={14} />
      </button>
      <div className="toolbar-divider" />
      <button title="Ask AI about this passage" onClick={() => { onAskAI(); onDismiss(); }}>
        <MessageSquarePlus size={14} />
      </button>
      <div className="toolbar-divider" />
      <button title="Dismiss" onClick={onDismiss}>
        <X size={12} />
      </button>
    </div>
  );
}

// ── Render text with multi-colour highlights ───────────────────────────
function renderWithHighlights(text, chunkHighlights) {
  if (!chunkHighlights?.length) return text;
  const ranges = [];
  for (const h of chunkHighlights) {
    if (!h.text) continue;
    let from = 0, idx;
    while ((idx = text.indexOf(h.text, from)) !== -1) {
      ranges.push([idx, idx + h.text.length, h.id, h.color || 'amber']);
      from = idx + h.text.length;
    }
  }
  if (!ranges.length) return text;
  ranges.sort((a, b) => a[0] - b[0]);
  const segs = [];
  let cursor = 0;
  for (const [start, end, id, color] of ranges) {
    if (start < cursor) continue;
    if (start > cursor) segs.push({ text: text.slice(cursor, start), mark: false });
    segs.push({ text: text.slice(start, end), mark: true, id, color });
    cursor = end;
  }
  if (cursor < text.length) segs.push({ text: text.slice(cursor), mark: false });
  return segs.map((s, i) =>
    s.mark
      ? <mark key={`${s.id}-${i}`} className="reading-highlight" data-color={s.color}>{s.text}</mark>
      : <span key={i}>{s.text}</span>
  );
}

function countWords(chunks) {
  return (chunks || []).reduce((n, c) => n + (c.content?.split(/\s+/).length || 0), 0);
}

// ══════════════════════════════════════════════════════════════════════
export default function ReadingMode({ book, targetChunk = null, onTargetChunkConsumed, onAskAboutPassage }) {
  const {
    chunks, currentPage, totalPages,
    chunksLoading, nextPage, prevPage, saveProgress, jumpToChunk,
    highlights, addHighlight,
    bookmarks, addBookmark, removeBookmark,
  } = useBook(book.id);

  // ── Preferences (persisted) ───────────────────────────────────────
  const [theme,      setTheme]      = useState(() => getStoredPref('reader_theme',      'light'));
  const [fontSize,   setFontSize]   = useState(() => getStoredPref('reader_font_size',  'medium'));
  const [lineHeight, setLineHeight] = useState(() => getStoredPref('reader_line_height','normal'));
  const [fontFace,   setFontFace]   = useState(() => getStoredPref('reader_font_face',  'serif'));

  // ── UI state ──────────────────────────────────────────────────────
  const [showSettings,   setShowSettings]   = useState(false);
  const [showBookmarks,  setShowBookmarks]  = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showContents,   setShowContents]   = useState(false);
  const [pageDir,        setPageDir]        = useState('forward');
  const [selToolbar,     setSelToolbar]     = useState(null);
  const contentRef  = useRef(null);
  const touchStartX = useRef(null);

  // Persist preferences
  useEffect(() => { storePref('reader_theme', theme); }, [theme]);
  useEffect(() => { storePref('reader_font_size',   fontSize);   }, [fontSize]);
  useEffect(() => { storePref('reader_line_height', lineHeight); }, [lineHeight]);

  // Night-mode cascade — propagate theme to <html> so the Navbar and
  // page background darken coherently with the reader's Night palette.
  // index.css responds to html[data-reader-theme="night"].
  useEffect(() => {
    document.documentElement.setAttribute('data-reader-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-reader-theme');
    };
  }, [theme]);
  useEffect(() => { storePref('reader_font_face',   fontFace);   }, [fontFace]);

  // Save position on page change
  useEffect(() => {
    if (!chunks.length) return;
    saveProgress(chunks[0]?.chunk_index || 0);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Jump to targeted chunk (e.g. from a bookmark click elsewhere)
  useEffect(() => {
    if (targetChunk !== null && targetChunk !== undefined) {
      jumpToChunk(targetChunk);
      onTargetChunkConsumed?.();
    }
  }, [targetChunk]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard ─────────────────────────────────────────────────────
  useEffect(() => {
    function handler(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { setPageDir('forward'); nextPage(); }
      if (e.key === 'ArrowLeft')  { setPageDir('back');    prevPage(); }
      if (e.key === 't' || e.key === 'T') cycleTheme();
      if (e.key === 'b' || e.key === 'B') quickBookmark();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ── Mobile swipe ─────────────────────────────────────────────────
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) { setPageDir('forward'); nextPage(); }
      else         { setPageDir('back');    prevPage(); }
    }
    touchStartX.current = null;
  };

  // ── Tap zones (left/right third = prev/next) ──────────────────────
  const onContentClick = (e) => {
    if (selToolbar) { setSelToolbar(null); return; }
    const w = window.innerWidth;
    const x = e.clientX;
    if (x < w * 0.25)      { setPageDir('back');    prevPage(); }
    else if (x > w * 0.75) { setPageDir('forward'); nextPage(); }
  };

  // ── Text selection → toolbar ──────────────────────────────────────
  const onMouseUp = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text || text.length < 3) { setSelToolbar(null); return; }
    const range = sel.getRangeAt(0);
    const rect  = range.getBoundingClientRect();
    const chunkEl = range.startContainer.parentElement?.closest('[data-chunk-index]');
    const chunkIndex = chunkEl ? parseInt(chunkEl.dataset.chunkIndex, 10) : (chunks[0]?.chunk_index || 0);
    setSelToolbar({
      x: rect.left + rect.width / 2 + window.scrollX,
      y: Math.max(rect.top + window.scrollY - 56, 60),
      text,
      chunkIndex,
    });
  }, [chunks]);

  // ── Actions ───────────────────────────────────────────────────────
  const cycleTheme = useCallback(() => {
    setTheme(prev => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length]);
  }, []);

  const quickBookmark = useCallback(() => {
    if (!chunks.length) return;
    const ci    = chunks[0].chunk_index;
    const label = chunks[0].chapter_title || `Page ${currentPage}`;
    addBookmark?.(ci, label);
    toast.success('Bookmarked');
  }, [chunks, currentPage, addBookmark]);

  const handleHighlight = useCallback((color) => {
    if (!selToolbar?.text) return;
    addHighlight(selToolbar.chunkIndex, selToolbar.text, color);
    window.getSelection()?.removeAllRanges();
  }, [selToolbar, addHighlight]);

  const handleBookmarkFromSel = useCallback(() => {
    if (!selToolbar) return;
    const label = selToolbar.text.slice(0, 60) + (selToolbar.text.length > 60 ? '…' : '');
    addBookmark?.(selToolbar.chunkIndex, label);
    toast.success('Bookmarked');
  }, [selToolbar, addBookmark]);

  const handleAskAI = useCallback(() => {
    if (!selToolbar?.text) return;
    onAskAboutPassage?.(selToolbar.text, selToolbar.chunkIndex);
    toast('Opening chat with your selection…', { icon: '💬' });
  }, [selToolbar, onAskAboutPassage]);

  // ── Stats ─────────────────────────────────────────────────────────
  const wordsOnPage = countWords(chunks);
  const minsLeft    = Math.max(1, Math.ceil(wordsOnPage / WORDS_PER_MIN));
  const pctDone     = totalPages > 1 ? Math.round(((currentPage - 1) / (totalPages - 1)) * 100) : 100;
  const currentChapter = chunks[0]?.chapter_title || null;
  const ThemeIcon      = THEME_ICONS[theme];
  const readingFont    = fontFace === 'serif' ? 'var(--reader-font-serif)' : 'var(--reader-font-sans)';

  // ── Sidebar toggle helper ─────────────────────────────────────────
  const closeAllPanels = () => { setShowBookmarks(false); setShowHighlights(false); setShowContents(false); };

  return (
    <div
      className="reader-root reader-surface"
      data-reader-theme={theme}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--reader-bg)', borderBottom: '1px solid var(--reader-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', gap: '12px', transition: 'background 0.25s ease',
      }}>
        <button
          onClick={() => { closeAllPanels(); setShowContents(v => !v); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reader-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'var(--reader-font-sans)' }}
        >
          <Menu size={16} />
          <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentChapter || 'Contents'}
          </span>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
          <span style={{ fontSize: '12px', color: 'var(--reader-muted)', fontFamily: 'var(--reader-font-sans)' }}>
            {currentPage} / {totalPages} · {pctDone}% · ~{minsLeft} min left
          </span>
          <div style={{ width: '100%', maxWidth: '200px', height: '2px', background: 'var(--reader-border)', borderRadius: '1px' }}>
            <div style={{ width: `${pctDone}%`, height: '100%', background: '#f5a623', borderRadius: '1px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button title="Bookmarks (B)" onClick={() => { closeAllPanels(); setShowBookmarks(v => !v); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: showBookmarks ? '#f5a623' : 'var(--reader-muted)', padding: '6px', borderRadius: '6px' }}>
            <Bookmark size={16} />
          </button>
          <button title="Highlights" onClick={() => { closeAllPanels(); setShowHighlights(v => !v); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: showHighlights ? '#f5a623' : 'var(--reader-muted)', padding: '6px', borderRadius: '6px' }}>
            <Highlighter size={16} />
          </button>
          <button title={`Theme: ${theme} (T)`} onClick={cycleTheme}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reader-muted)', padding: '6px', borderRadius: '6px' }}>
            <ThemeIcon size={16} />
          </button>
          <button title="Reading settings" onClick={() => setShowSettings(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: showSettings ? '#f5a623' : 'var(--reader-muted)', padding: '6px', borderRadius: '6px' }}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── Settings panel ────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            key="settings"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden', background: 'var(--reader-bg)', borderBottom: '1px solid var(--reader-border)', zIndex: 90 }}
          >
            <div style={{ padding: '14px 24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start', maxWidth: '760px', margin: '0 auto' }}>
              {/* Font family */}
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ fontSize: '10px', fontWeight: 700, color: 'var(--reader-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', fontFamily: 'var(--reader-font-sans)' }}>Font</legend>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['serif','sans'].map(f => (
                    <button key={f} onClick={() => setFontFace(f)}
                      style={{ padding: '5px 12px', borderRadius: '6px', border: `1px solid ${fontFace===f ? '#f5a623' : 'var(--reader-border)'}`, background: fontFace===f ? '#f5a62315' : 'transparent', color: fontFace===f ? '#f5a623' : 'var(--reader-text)', fontSize: '13px', cursor: 'pointer', fontFamily: f==='serif' ? 'Lora,Georgia,serif' : 'inherit' }}>
                      {f === 'serif' ? 'Lora' : 'Sans'}
                    </button>
                  ))}
                </div>
              </fieldset>
              {/* Font size */}
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ fontSize: '10px', fontWeight: 700, color: 'var(--reader-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', fontFamily: 'var(--reader-font-sans)' }}>Size</legend>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {Object.keys(FONT_SIZES).map(s => (
                    <button key={s} onClick={() => setFontSize(s)}
                      style={{ padding: '4px 9px', borderRadius: '6px', border: `1px solid ${fontSize===s ? '#f5a623' : 'var(--reader-border)'}`, background: fontSize===s ? '#f5a62315' : 'transparent', color: fontSize===s ? '#f5a623' : 'var(--reader-text)', fontSize: '11px', cursor: 'pointer', fontWeight: fontSize===s ? 700 : 400, fontFamily: 'var(--reader-font-sans)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              {/* Line height */}
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ fontSize: '10px', fontWeight: 700, color: 'var(--reader-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', fontFamily: 'var(--reader-font-sans)' }}>Spacing</legend>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {Object.keys(LINE_HEIGHTS).map(k => (
                    <button key={k} onClick={() => setLineHeight(k)}
                      style={{ padding: '4px 9px', borderRadius: '6px', border: `1px solid ${lineHeight===k ? '#f5a623' : 'var(--reader-border)'}`, background: lineHeight===k ? '#f5a62315' : 'transparent', color: lineHeight===k ? '#f5a623' : 'var(--reader-text)', fontSize: '11px', cursor: 'pointer', fontWeight: lineHeight===k ? 700 : 400, fontFamily: 'var(--reader-font-sans)' }}>
                      {k}
                    </button>
                  ))}
                </div>
              </fieldset>
              {/* Theme */}
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ fontSize: '10px', fontWeight: 700, color: 'var(--reader-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', fontFamily: 'var(--reader-font-sans)' }}>Theme (T)</legend>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {THEMES.map(t => { const TI = THEME_ICONS[t]; return (
                    <button key={t} onClick={() => setTheme(t)}
                      style={{ padding: '4px 9px', borderRadius: '6px', border: `1px solid ${theme===t ? '#f5a623' : 'var(--reader-border)'}`, background: theme===t ? '#f5a62315' : 'transparent', color: theme===t ? '#f5a623' : 'var(--reader-text)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--reader-font-sans)' }}>
                      <TI size={12} /> {t}
                    </button>
                  ); })}
                </div>
              </fieldset>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Side panel (bookmarks / highlights / contents) ────── */}
      <AnimatePresence>
        {(showBookmarks || showHighlights || showContents) && (
          <motion.div
            key="side-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px',
              zIndex: 300, background: 'var(--reader-bg)',
              borderLeft: '1px solid var(--reader-border)',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--reader-border)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--reader-text)', fontFamily: 'var(--reader-font-sans)' }}>
                {showBookmarks ? 'Bookmarks' : showHighlights ? 'Highlights' : 'Contents'}
              </h3>
              <button onClick={closeAllPanels} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reader-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {showBookmarks && (
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(!bookmarks?.length) && (
                  <p style={{ fontSize: '13px', color: 'var(--reader-muted)', textAlign: 'center', marginTop: '32px', fontFamily: 'var(--reader-font-sans)', lineHeight: 1.5 }}>
                    No bookmarks yet.{'\n'}Press <kbd style={{ background: 'var(--reader-border)', padding: '1px 5px', borderRadius: '3px', fontSize: '11px' }}>B</kbd> or select text and tap the bookmark icon.
                  </p>
                )}
                {(bookmarks || []).map(bm => (
                  <div key={bm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'var(--reader-border)', borderRadius: '8px' }}>
                    <BookmarkCheck size={13} style={{ color: '#f5a623', flexShrink: 0 }} />
                    <button
                      onClick={() => { jumpToChunk(bm.chunk_index); closeAllPanels(); }}
                      style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--reader-text)', lineHeight: 1.4, fontFamily: 'var(--reader-font-sans)' }}
                    >
                      {bm.label || `Chunk ${bm.chunk_index}`}
                    </button>
                    <button onClick={() => removeBookmark?.(bm.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reader-muted)' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showHighlights && (
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(!highlights?.length) && (
                  <p style={{ fontSize: '13px', color: 'var(--reader-muted)', textAlign: 'center', marginTop: '32px', fontFamily: 'var(--reader-font-sans)' }}>
                    No highlights yet. Select text while reading to highlight it.
                  </p>
                )}
                {(highlights || []).map(h => {
                  const c = HIGHLIGHT_COLORS.find(x => x.id === (h.color || 'amber')) || HIGHLIGHT_COLORS[0];
                  return (
                    <div key={h.id} style={{ padding: '10px 12px', borderRadius: '8px', borderLeft: `3px solid ${c.hex}`, background: `${c.hex}12` }}>
                      <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--reader-text)', lineHeight: 1.5, fontFamily: 'var(--reader-font-serif)', fontStyle: 'italic' }}>
                        "{h.text}"
                      </p>
                      <button
                        onClick={() => jumpToChunk(h.chunk_index)}
                        style={{ fontSize: '11px', color: 'var(--reader-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--reader-font-sans)' }}
                      >
                        Jump to passage →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {showContents && (
              <div style={{ padding: '14px' }}>
                <ChapterNav book={book} onNavigate={(ci) => { jumpToChunk(ci); closeAllPanels(); }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reading area ──────────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{ flex: 1, overflowY: 'auto', padding: '48px 24px 96px', cursor: 'default', userSelect: 'text', minHeight: 0 }}
        onMouseUp={onMouseUp}
        onClick={onContentClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {chunksLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <SpinnerOverlay />
          </div>
        ) : (
          <motion.div
            key={currentPage}
            className={pageDir === 'forward' ? 'reader-page-enter' : 'reader-page-prev'}
          >
            {/* Chapter title */}
            {currentChapter && (
              <div className="reader-chapter-title" style={{ fontFamily: 'var(--reader-font-serif)' }}>
                {currentChapter}
              </div>
            )}

            {/* Continuous prose — all chunks on this page */}
            <div
              className="reader-prose"
              style={{
                fontFamily: readingFont,
                fontSize: FONT_SIZES[fontSize],
                lineHeight: LINE_HEIGHTS[lineHeight],
              }}
            >
              {chunks.map((chunk) => {
                const chunkHighlights = (highlights || []).filter(h => h.chunk_index === chunk.chunk_index);
                // Treat double-newlines as paragraph breaks; single newlines as soft breaks
                const paras = (chunk.content || '').split(/\n{2,}/).filter(Boolean);
                return (
                  <div key={chunk.id || chunk.chunk_index} data-chunk-index={chunk.chunk_index}>
                    {paras.length > 1
                      ? paras.map((para, pi) => (
                          <p key={pi}>{renderWithHighlights(para.trim(), chunkHighlights)}</p>
                        ))
                      : <p>{renderWithHighlights((chunk.content || '').trim(), chunkHighlights)}</p>
                    }
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Bottom navigation ─────────────────────────────────── */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 100,
        background: 'var(--reader-bg)', borderTop: '1px solid var(--reader-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', gap: '16px', transition: 'background 0.25s ease',
      }}>
        <button
          onClick={() => { setPageDir('back'); prevPage(); }}
          disabled={currentPage <= 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', borderRadius: '8px',
            border: '1px solid var(--reader-border)', background: 'transparent',
            color: currentPage <= 1 ? 'var(--reader-muted)' : 'var(--reader-text)',
            cursor: currentPage <= 1 ? 'default' : 'pointer',
            fontSize: '13px', fontFamily: 'var(--reader-font-sans)',
            opacity: currentPage <= 1 ? 0.35 : 1, transition: 'opacity 0.15s ease',
          }}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <span style={{ fontSize: '12px', color: 'var(--reader-muted)', fontFamily: 'var(--reader-font-sans)' }}>
          {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => { setPageDir('forward'); nextPage(); }}
          disabled={currentPage >= totalPages}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', borderRadius: '8px', border: 'none',
            background: currentPage >= totalPages ? 'transparent' : '#f5a623',
            color: currentPage >= totalPages ? 'var(--reader-muted)' : '#1c1c1c',
            cursor: currentPage >= totalPages ? 'default' : 'pointer',
            fontSize: '13px', fontFamily: 'var(--reader-font-sans)', fontWeight: 600,
            opacity: currentPage >= totalPages ? 0.35 : 1, transition: 'all 0.15s ease',
            border: currentPage >= totalPages ? '1px solid var(--reader-border)' : 'none',
          }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Selection toolbar (floating) ──────────────────────── */}
      <SelectionToolbar
        pos={selToolbar}
        onHighlight={handleHighlight}
        onBookmark={handleBookmarkFromSel}
        onAskAI={handleAskAI}
        onDismiss={() => { setSelToolbar(null); window.getSelection()?.removeAllRanges(); }}
      />
    </div>
  );
}
