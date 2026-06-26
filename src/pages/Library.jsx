import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Upload, Link2, FileText, PenLine } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import BookCard from '../components/book/BookCard.jsx';
import BookUpload from '../components/book/BookUpload.jsx';
import URLIngester from '../components/source/URLIngester.jsx';
import TextIngester from '../components/source/TextIngester.jsx';
import Modal from '../components/ui/Modal.jsx';
import { getBooksSlim, getSessions, getStudyRecommendations, getBookStatus, groupBySourceType, deleteBook } from '../lib/api.js';
import { LEARNING_MODES, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import toast from 'react-hot-toast';

const INTAKE_TABS = [
  { id: 'file', label: 'Upload File', icon: Upload },
  { id: 'url', label: 'Paste URL', icon: Link2 },
  { id: 'text', label: 'Paste Text', icon: FileText },
  { id: 'note', label: 'Write Note', icon: PenLine },
];

const MODE_BY_ID = Object.fromEntries(LEARNING_MODES.map(m => [m.id, m]));

// Module-level cache
let _booksCache = null;
let _booksCacheTime = 0;
const CACHE_TTL = 15000;

// Sub-components

function HeroCoverCard({ book, index, onClick }) {
  const sizes = [
    { w: 80, h: 130 },
    { w: 96, h: 155 },
    { w: 112, h: 180 },
  ];
  const rotations = [-4, 1, 0];
  const { w, h } = sizes[index] || sizes[2];
  const rot = rotations[index] || 0;
  const color = book.cover_color || '#1a3a5c';

  return (
    <motion.div
      whileHover={{ rotate: 0, scale: 1.03 }}
      onClick={onClick}
      style={{
        width: `${w}px`, height: `${h}px`, borderRadius: '8px', flexShrink: 0,
        background: `linear-gradient(160deg, ${color}ee 0%, ${color}88 100%)`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transform: `rotate(${rot}deg)`,
        transition: 'transform 0.2s',
        cursor: 'pointer',
        display: 'flex', alignItems: 'flex-end', padding: '8px', overflow: 'hidden'
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {book.title}
      </p>
    </motion.div>
  );
}

function FilterPill({ active, onClick, label, color, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '6px 14px', borderRadius: '999px',
        border: `1px solid ${active ? (color || '#1c1c1c') : '#eceae4'}`,
        background: active ? (color ? `${color}15` : '#1c1c1c') : '#fbf9f3',
        color: active ? (color || '#fbf9f3') : '#5f5f5d',
        fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer',
        transition: 'all 0.15s', whiteSpace: 'nowrap'
      }}
    >
      {label}{count > 0 ? ` (${count})` : ''}
    </button>
  );
}

function StripBookCard({ book, onClick, onDelete }) {
  const color = book.cover_color || '#1a3a5c';
  const isReady = book.status === 'ready';
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try { await onDelete(book.id); } finally { setDeleting(false); setConfirmDelete(false); }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); if (!confirmDelete) setConfirmDelete(false); }}
      onClick={onClick}
      style={{
        width: '140px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden',
        border: '1px solid #eceae4', cursor: 'pointer', background: '#fbf9f3',
        transition: 'all 0.2s', position: 'relative'
      }}
    >
      <div style={{
        width: '140px', height: '140px', position: 'relative',
        background: `linear-gradient(160deg, ${color}ee 0%, ${color}66 100%)`
      }}>
        {/* Delete button — shown on hover */}
        {onDelete && !confirmDelete && (
          <motion.button
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            title="Delete"
            style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.50)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fbf9f3', pointerEvents: hovered ? 'auto' : 'none', zIndex: 2
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </motion.button>
        )}
        {/* Confirm overlay */}
        {confirmDelete && (
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'absolute', inset: 0, background: 'rgba(30,10,10,0.82)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '8px', padding: '10px', zIndex: 3
          }}>
            <p style={{ color: '#fbf9f3', fontSize: '11px', textAlign: 'center', lineHeight: 1.4 }}>Delete this book?</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleConfirmDelete} disabled={deleting} style={{
                padding: '4px 10px', borderRadius: '5px', border: 'none',
                background: '#c85250', color: '#fff', fontSize: '11px',
                fontWeight: 600, cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.7 : 1
              }}>{deleting ? '…' : 'Delete'}</button>
              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }} style={{
                padding: '4px 10px', borderRadius: '5px',
                border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
                color: '#fbf9f3', fontSize: '11px', cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </div>
        )}
        {!isReady && !confirmDelete && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(247,244,237,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%',
              border: '2px solid rgba(245,166,35,0.2)', borderTopColor: '#f5a623',
              animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
      </div>
      <div style={{ padding: '8px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#1c1c1c', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </p>
        <p style={{ fontSize: '11px', color: '#8f8a80', marginTop: '2px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {book.author || 'Unknown'}
        </p>
      </div>
    </motion.div>
  );
}

function AddSourceCard({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '140px', height: '188px', flexShrink: 0, borderRadius: '8px',
        border: `2px dashed ${hov ? '#f5a623' : '#eceae4'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '6px', cursor: 'pointer', transition: 'all 0.15s', background: 'transparent'
      }}
    >
      <Plus size={24} color={hov ? '#f5a623' : '#b8b3a8'} />
      <span style={{ fontSize: '11px', color: hov ? '#f5a623' : '#8f8a80', fontWeight: 500 }}>Add source</span>
    </div>
  );
}

function SourceTypeStrip({ sourceType, books, color, onBookClick, onAddClick, onDelete }) {
  if (!books.length) return null;
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', marginBottom: '12px' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#1c1c1c', textTransform: 'capitalize' }}>{sourceType}s</h3>
        <span style={{ fontSize: '12px', color: '#8f8a80' }}>{books.length}</span>
      </div>
      <div className="no-scrollbar strip-scroll" style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 24px 8px' }}>
        {books.map(book => (
          <StripBookCard key={book.id} book={book} onClick={() => onBookClick(book)} onDelete={onDelete} />
        ))}
        <AddSourceCard onClick={onAddClick} />
      </div>
    </div>
  );
}

function ModeTile({ mode, onSelect }) {
  const Icon = mode.icon;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: '8px', padding: '16px', borderRadius: '12px',
        border: '1px solid #eceae4', background: '#fbf9f3',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = mode.color; e.currentTarget.style.background = `${mode.color}08`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#eceae4'; e.currentTarget.style.background = '#fbf9f3'; }}
    >
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${mode.color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} style={{ color: mode.color }} />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1c1c1c', marginBottom: '2px' }}>{mode.label}</p>
        <p style={{ fontSize: '12px', color: '#5f5f5d', lineHeight: 1.4 }}>{mode.description}</p>
      </div>
    </motion.button>
  );
}

// Main Page

export default function Library() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(_booksCache || []);
  const [sessions, setSessions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(!_booksCache);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [intakeTab, setIntakeTab] = useState('file');
  const [activeFilter, setActiveFilter] = useState(null);
  const [quickTopic, setQuickTopic] = useState('');
  const pollRef = useRef(null);

  const groupedBooks = useMemo(() => groupBySourceType(books), [books]);
  const recentBooks = useMemo(() => books.filter(b => b.status === 'ready').slice(0, 3), [books]);
  const lastSession = sessions[0] || null;
  const sourceTypesWithBooks = useMemo(() =>
    activeFilter
      ? (groupedBooks[activeFilter] ? [activeFilter] : [])
      : Object.keys(groupedBooks).filter(t => groupedBooks[t].length > 0),
    [groupedBooks, activeFilter]
  );

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(() => _booksCache ? false : true);
    try {
      const [booksRes, sessionsRes, recsRes] = await Promise.all([
        getBooksSlim(),
        getSessions().catch(() => ({ data: [] })),
        getStudyRecommendations().catch(() => ({ data: { recommendations: [] } })),
      ]);
      const list = booksRes.data || [];
      _booksCache = list;
      _booksCacheTime = Date.now();
      setBooks(list);
      setSessions(sessionsRes.data || []);
      setRecommendations(recsRes.data?.recommendations || []);
    } catch {
      if (!silent) toast.error('Failed to load your library');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (_booksCache && Date.now() - _booksCacheTime < CACHE_TTL) {
      setLoading(false);
      fetchAll(true);
    } else {
      fetchAll(false);
    }
  }, [fetchAll]);

  // Poll processing books
  useEffect(() => {
    const processing = books.filter(b => b.status === 'processing' || b.status === 'pending');
    if (!processing.length) { clearInterval(pollRef.current); return; }
    pollRef.current = setInterval(async () => {
      try {
        const checks = await Promise.all(processing.map(b => getBookStatus(b.id).then(r => r.data)));
        let anyReady = false;
        setBooks(prev => {
          const updated = [...prev];
          checks.forEach(s => {
            const idx = updated.findIndex(b => b.id === s.id);
            if (idx === -1) return;
            if (updated[idx].status !== s.status) {
              updated[idx] = { ...updated[idx], ...s };
              if (s.status === 'ready') { anyReady = true; toast.success(`"${s.title || updated[idx].title}" is ready!`); }
            }
          });
          return updated;
        });
        if (anyReady) fetchAll(true);
      } catch {}
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [books, fetchAll]);

  const handleUploaded = () => {
    setUploadOpen(false);
    _booksCache = null;
    fetchAll(false);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      // Remove from local state immediately — no refetch needed
      _booksCache = null;
      setBooks(prev => prev.filter(b => b.id !== bookId));
      toast.success('Book deleted');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f4ed' }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(245,166,35,0.2)', borderTopColor: '#f5a623', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed', paddingBottom: '80px' }}>
      <Navbar />

      {/* Section 1 - Announcement strip */}
      {lastSession && (
        <div style={{ background: '#1c1c1c', color: '#fbf9f3', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>
            <span style={{ color: '#f5a623', fontWeight: 600, marginRight: '8px' }}>Continue -&gt;</span>
            "{lastSession.topic}"
            <span style={{ color: '#8f8a80' }}> — {MODE_BY_ID[lastSession.mode]?.label || lastSession.mode} Mode</span>
          </span>
          <button
            onClick={() => navigate(`/learn/${lastSession.id}`)}
            style={{ background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '6px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            Resume
          </button>
        </div>
      )}

      {/* Section 2 - Hero */}
      <section style={{ padding: '32px 24px 24px', borderBottom: '1px solid #eceae4' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: recentBooks.length ? '1fr 320px' : '1fr', gap: '32px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Your Knowledge Canon
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1c1c1c', lineHeight: 1.2, marginBottom: '16px' }}>
              {books.length} source{books.length !== 1 ? 's' : ''}.<br />
              What will you learn today?
            </h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                placeholder="Ask anything across your canon..."
                onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) navigate('/learn', { state: { topic: e.target.value } }); }}
                style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #eceae4', padding: '0 16px', fontSize: '14px', background: '#fbf9f3', outline: 'none' }}
              />
              <button
                onClick={() => navigate('/learn')}
                style={{ height: '44px', padding: '0 20px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                Learn
              </button>
            </div>
          </div>
          {recentBooks.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              {recentBooks.map((book, i) => (
                <HeroCoverCard key={book.id} book={book} index={i} onClick={() => navigate(`/source/${book.id}`)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3 - Browse strips */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid #eceae4' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1c1c' }}>Browse your canon</h2>
            <button onClick={() => setUploadOpen(true)} style={{ fontSize: '13px', color: '#f5a623', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              + Add source
            </button>
          </div>

          {/* Filter pills */}
          <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 24px', marginBottom: '20px' }}>
            <FilterPill active={activeFilter === null} onClick={() => setActiveFilter(null)} label="All" count={0} />
            {Object.keys(SOURCE_TYPE_COLORS).filter(t => groupedBooks[t]?.length > 0).map(type => (
              <FilterPill
                key={type}
                active={activeFilter === type}
                onClick={() => setActiveFilter(t => t === type ? null : type)}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                color={SOURCE_TYPE_COLORS[type]}
                count={groupedBooks[type]?.length || 0}
              />
            ))}
          </div>

          {books.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '15px', color: '#5f5f5d', marginBottom: '16px' }}>Your knowledge base is empty.</p>
              <button onClick={() => setUploadOpen(true)} style={{ padding: '10px 24px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Add your first source
              </button>
            </div>
          ) : (
            sourceTypesWithBooks.map(sourceType => (
              <SourceTypeStrip
                key={sourceType}
                sourceType={sourceType}
                books={groupedBooks[sourceType] || []}
                color={SOURCE_TYPE_COLORS[sourceType] || '#5f5f5d'}
                onBookClick={(book) => navigate(`/source/${book.id}`)}
                onAddClick={() => setUploadOpen(true)}
                onDelete={handleDeleteBook}
              />
            ))
          )}
        </div>
      </section>

      {/* Section 4 - What to study next */}
      {books.length > 0 && (
        <section style={{ padding: '32px 24px', borderBottom: '1px solid #eceae4', background: '#fbf9f3' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Based on your recent sessions
              </p>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1c1c' }}>What to study next</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {(recommendations.length > 0 ? recommendations : books.filter(b => b.status === 'ready').slice(0, 4))
                .map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => navigate(`/source/${book.id}`)}
                    showConnectionReason={!!book.connection_reason}
                    connectionReason={book.connection_reason || 'In your canon'}
                    onDelete={handleDeleteBook}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5 - Mode selector */}
      <section style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Choose how you want to think
            </p>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1c1c' }}>Start a learning experience</h2>
          </div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <input
              value={quickTopic}
              onChange={e => setQuickTopic(e.target.value)}
              placeholder="Enter a topic, question, or concept..."
              style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #eceae4', padding: '0 16px', fontSize: '14px', background: '#fbf9f3', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {LEARNING_MODES.map(mode => (
              <ModeTile
                key={mode.id}
                mode={mode}
                onSelect={() => navigate('/learn', { state: { topic: quickTopic || undefined, mode: mode.id } })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      <Modal open={uploadOpen} onClose={() => { setUploadOpen(false); setIntakeTab('file'); }} title="Add to Your Knowledge Base" size="lg">
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #eceae4', marginTop: '-4px' }}>
          {INTAKE_TABS.map(tab => (
            <button key={tab.id} onClick={() => setIntakeTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '13px',
                fontWeight: intakeTab === tab.id ? 600 : 400,
                color: intakeTab === tab.id ? '#f5a623' : '#5f5f5d',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${intakeTab === tab.id ? '#f5a623' : 'transparent'}`,
                cursor: 'pointer' }}>
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>
        {intakeTab === 'file' && <BookUpload onUploaded={handleUploaded} onClose={() => setUploadOpen(false)} />}
        {intakeTab === 'url' && <URLIngester onIngested={handleUploaded} onClose={() => setUploadOpen(false)} />}
        {intakeTab === 'text' && <TextIngester onIngested={handleUploaded} onClose={() => setUploadOpen(false)} />}
        {intakeTab === 'note' && <TextIngester lockedType="note" onIngested={handleUploaded} onClose={() => setUploadOpen(false)} />}
      </Modal>
    </div>
  );
}
