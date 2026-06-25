import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Highlighter, Menu } from 'lucide-react';
import { useBook } from '../../hooks/useBook.js';
import ChapterNav from './ChapterNav.jsx';
import { SpinnerOverlay } from '../ui/LoadingScreen.jsx';
import { searchBookChapters } from '../../lib/api.js';
import { Progress } from '@/components/ui/shadcn/progress.jsx';
import { Separator } from '@/components/ui/shadcn/separator.jsx';
import { Badge } from '@/components/ui/shadcn/badge.jsx';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/shadcn/sheet.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcn/tooltip.jsx';
import toast from 'react-hot-toast';

const FONT_SIZE_MAP = { small: '17px', medium: '19px', large: '22px' };
const WORDS_PER_MIN = 200;

/** Split a chunk's plain text into segments, wrapping any saved highlight matches in <mark>. */
function renderWithHighlights(text, chunkHighlights) {
  if (!chunkHighlights || chunkHighlights.length === 0) return text;
  const ranges = [];
  for (const h of chunkHighlights) {
    if (!h.text) continue;
    let from = 0, idx;
    while ((idx = text.indexOf(h.text, from)) !== -1) {
      ranges.push([idx, idx + h.text.length, h.id]);
      from = idx + h.text.length;
    }
  }
  if (ranges.length === 0) return text;
  ranges.sort((a, b) => a[0] - b[0]);
  const segments = [];
  let cursor = 0;
  for (const [start, end, id] of ranges) {
    if (start < cursor) continue;
    if (start > cursor) segments.push({ text: text.slice(cursor, start), mark: false });
    segments.push({ text: text.slice(start, end), mark: true, id });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), mark: false });
  return segments.map((seg, i) =>
    seg.mark
      ? <mark key={`${seg.id}-${i}`} className="reading-highlight">{seg.text}</mark>
      : <span key={i}>{seg.text}</span>
  );
}

export default function ReadingMode({ book, targetChunk = null, onTargetChunkConsumed }) {
  const {
    chunks, currentPage, totalPages,
    chunksLoading, nextPage, prevPage, saveProgress, jumpToChunk, goToPage,
    highlights, addHighlight
  } = useBook(book.id);

  const [fontSize, setFontSize] = useState('medium');
  const [focusMode, setFocusMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectionToolbar, setSelectionToolbar] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const chapters = book.chapter_breakdown || [];

  const contentRef = useRef(null);
  const paraRefs = useRef([]);

  const currentChapterTitle = chunks[0]?.chapter_title || null;
  const prevChapterRef = useRef(null);
  const chapterChanged = currentChapterTitle !== prevChapterRef.current;
  if (chapterChanged) prevChapterRef.current = currentChapterTitle;

  useEffect(() => {
    const topChunk = chunks[0]?.chunk_index || 0;
    saveProgress(topChunk);
  }, [currentPage]);

  useEffect(() => {
    if (targetChunk !== null && targetChunk !== undefined) {
      jumpToChunk(targetChunk);
      onTargetChunkConsumed?.();
    }
  }, [targetChunk]);

  const cycleFontSize = (dir) => {
    const sizes = ['small', 'medium', 'large'];
    const idx = sizes.indexOf(fontSize);
    setFontSize(sizes[(idx + dir + sizes.length) % sizes.length]);
  };

  // Focus mode: dim paragraphs except the one nearest centre
  useEffect(() => {
    if (!focusMode || !contentRef.current) return;
    setActiveIndex(0);
    const root = contentRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry;
          }
        }
        if (best) {
          const idx = Number(best.target.dataset.paraIndex);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root, rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    paraRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [focusMode, chunks]);

  // Text selection highlight toolbar
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !contentRef.current) { setSelectionToolbar(null); return; }
    const text = sel.toString().trim();
    if (!text || text.length > 600) { setSelectionToolbar(null); return; }
    const anchorEl = sel.anchorNode?.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
    const paraEl = anchorEl?.closest?.('[data-chunk-index]');
    if (!paraEl || !contentRef.current.contains(paraEl)) { setSelectionToolbar(null); return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = contentRef.current.getBoundingClientRect();
    setSelectionToolbar({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top - 42,
      chunkIndex: Number(paraEl.dataset.chunkIndex),
      text
    });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  const handleHighlightClick = () => {
    if (!selectionToolbar) return;
    addHighlight(selectionToolbar.chunkIndex, selectionToolbar.text);
    toast.success('Highlighted');
    window.getSelection()?.removeAllRanges();
    setSelectionToolbar(null);
  };

  // Multi-strategy chapter navigation
  const handleChapterClick = async (chapterTitle) => {
    setMobileNavOpen(false);
    // Strategy 1: full title
    try {
      const { data } = await searchBookChapters(book.id, chapterTitle, 1);
      if (data?.chunks?.length > 0) { jumpToChunk(data.chunks[0].chunk_index); return; }
    } catch (_) {}
    // Strategy 2: strip parentheticals
    const shortTitle = chapterTitle.replace(/\s*\(.*?\)\s*/g, '').trim().slice(0, 40);
    if (shortTitle && shortTitle !== chapterTitle.slice(0, 40)) {
      try {
        const { data } = await searchBookChapters(book.id, shortTitle, 1);
        if (data?.chunks?.length > 0) { jumpToChunk(data.chunks[0].chunk_index); return; }
      } catch (_) {}
    }
    // Strategy 3: first 4 words
    const firstWords = chapterTitle.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join(' ');
    if (firstWords) {
      try {
        const { data } = await searchBookChapters(book.id, firstWords, 1);
        if (data?.chunks?.length > 0) { jumpToChunk(data.chunks[0].chunk_index); return; }
      } catch (_) {}
    }
    // Strategy 4: estimated page
    const chapterIndex = (book.chapter_breakdown || []).findIndex(ch => ch.chapter === chapterTitle);
    if (chapterIndex >= 0) {
      const estimatedPage = Math.max(1, Math.ceil((chapterIndex / Math.max((book.chapter_breakdown || []).length, 1)) * totalPages));
      goToPage(estimatedPage);
      toast(`Jumped to approximately page ${estimatedPage}`, { icon: '📖' });
      return;
    }
    toast.error('Could not locate that chapter — try browsing by page');
  };

  const estimatedMinutes = useMemo(() => {
    const words = chunks.reduce((sum, c) => sum + (c.content?.split(/\s+/).filter(Boolean).length || 0), 0);
    return Math.max(1, Math.round(words / WORDS_PER_MIN));
  }, [chunks]);

  const progressPct = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  const ChapterNavContent = (
    <ChapterNav
      chapters={chapters}
      currentPage={currentPage}
      totalPages={totalPages}
      currentChapterTitle={currentChapterTitle}
      onPageChange={goToPage}
      onChapterClick={handleChapterClick}
    />
  );

  return (
    <div className="flex h-full overflow-hidden bg-[#f7f4ed]">
      {/* Left sidebar — desktop only */}
      <div className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-[#eceae4] bg-[#fbf9f3] h-full">
        {ChapterNavContent}
      </div>

      {/* Main reading area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 bg-[#f7f4ed]/95 backdrop-blur-sm border-b border-[#eceae4] px-4 py-2">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            {/* Mobile chapter nav trigger */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-1.5 text-[#5f5f5d] hover:text-[#1c1c1c] rounded" aria-label="Chapters">
                  <Menu size={16} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px] bg-[#fbf9f3] border-r border-[#eceae4]">
                <SheetHeader className="px-4 py-3 border-b border-[#eceae4]">
                  <SheetTitle className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">Chapters</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden h-[calc(100vh-56px)]">
                  {ChapterNavContent}
                </div>
              </SheetContent>
            </Sheet>

            {/* Progress bar */}
            <Progress
              value={progressPct}
              className="flex-1 h-1"
              style={{ '--tw-ring-color': '#f5a623' }}
            />
            <span className="text-xs text-[#8f8a80] whitespace-nowrap shrink-0">
              {currentPage}/{totalPages} · ~{estimatedMinutes}min
            </span>

            {/* Font size controls */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => cycleFontSize(-1)} className="text-[#8f8a80] hover:text-[#1c1c1c] text-xs px-1 py-0.5 rounded">A-</button>
                </TooltipTrigger>
                <TooltipContent>Smaller text</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => cycleFontSize(1)} className="text-[#8f8a80] hover:text-[#1c1c1c] text-sm px-1 py-0.5 rounded">A+</button>
                </TooltipTrigger>
                <TooltipContent>Larger text</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Focus mode */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      focusMode
                        ? 'border-[#f5a623] text-[#f5a623] bg-[#f5a623]/10'
                        : 'border-[#eceae4] text-[#8f8a80] hover:border-[#d4cfc6]'
                    }`}
                  >
                    Focus
                  </button>
                </TooltipTrigger>
                <TooltipContent>Dim surrounding paragraphs</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Reading content */}
        <ScrollArea className="flex-1">
          <div ref={contentRef} className="relative px-6 py-10 max-w-[72ch] mx-auto">
            {chunksLoading ? (
              <SpinnerOverlay message="Loading pages..." />
            ) : (
              <>
                {/* Chapter heading — shown when chapter changes */}
                <AnimatePresence mode="wait">
                  {currentChapterTitle && (
                    <motion.div
                      key={currentChapterTitle}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="my-10 text-center"
                    >
                      <Separator className="mb-8 bg-[#eceae4]" />
                      <Badge
                        variant="outline"
                        className="mb-3 text-[#f5a623] border-[#f5a623]/40 text-[10px] tracking-widest uppercase font-semibold"
                      >
                        {currentChapterTitle}
                      </Badge>
                      <Separator className="mt-8 bg-[#eceae4]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Paragraphs */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {chunks.map((chunk, i) => {
                      const paragraphs = chunk.content.split(/\n{2,}/).filter(p => p.trim());
                      const chunkHighlights = highlights.filter(h => h.chunk_index === chunk.chunk_index);
                      const isDimmed = focusMode && i !== activeIndex;
                      return (
                        <motion.div
                          key={chunk.chunk_index}
                          ref={el => (paraRefs.current[i] = el)}
                          data-chunk-index={chunk.chunk_index}
                          data-para-index={i}
                          animate={{ opacity: isDimmed ? 0.3 : 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          {paragraphs.map((para, pi) => (
                            <p
                              key={pi}
                              className="mb-[1.4em] select-text"
                              style={{
                                fontFamily: "'Georgia', 'Times New Roman', serif",
                                fontSize: FONT_SIZE_MAP[fontSize],
                                lineHeight: '1.9',
                                letterSpacing: '0.01em',
                                color: '#1c1c1c',
                                textIndent: (pi === 0 && i === 0) ? '0' : '2em',
                                textAlign: 'justify'
                              }}
                            >
                              {renderWithHighlights(para, chunkHighlights)}
                            </p>
                          ))}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </>
            )}

            {/* Floating highlight button on text selection */}
            {selectionToolbar && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute',
                  left: selectionToolbar.x,
                  top: Math.max(selectionToolbar.y, 8),
                  transform: 'translateX(-50%)'
                }}
                onClick={handleHighlightClick}
                className="flex items-center gap-1.5 bg-[#f5a623] text-[#1c1c1c] text-xs font-medium px-3 py-1.5 rounded-full shadow-lg z-10"
              >
                <Highlighter size={12} />
                Highlight
              </motion.button>
            )}
          </div>
        </ScrollArea>

        {/* Bottom pagination */}
        <div className="flex-shrink-0 flex items-center justify-center gap-4 px-6 py-3 border-t border-[#eceae4] bg-[#f7f4ed]">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 text-sm text-[#5f5f5d] hover:text-[#1c1c1c] disabled:opacity-30 px-3 py-2 rounded-lg hover:bg-[#fbf9f3] transition-colors"
          >
            <ChevronLeft size={15} /> Previous
          </button>
          <span className="text-[#5f5f5d] text-sm min-w-[100px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1.5 text-sm text-[#5f5f5d] hover:text-[#1c1c1c] disabled:opacity-30 px-3 py-2 rounded-lg hover:bg-[#fbf9f3] transition-colors"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        .reading-highlight {
          background: rgba(245, 166, 35, 0.28);
          color: #1c1c1c;
          border-radius: 3px;
          padding: 0 1px;
        }
      `}</style>
    </div>
  );
}
