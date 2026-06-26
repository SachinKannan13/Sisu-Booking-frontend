import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Tag, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getBook, createLearnSession } from '../lib/api.js';
import { LEARNING_MODES, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import { getGenreConfig } from '../utils/genreConfig.js';
import toast from 'react-hot-toast';

const EASE_OUT = [0.23, 1, 0.32, 1];

export default function SourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [source,          setSource]          = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [selectedMode,    setSelectedMode]    = useState('scholar');
  const [expandChapters,  setExpandChapters]  = useState(false);

  useEffect(() => {
    getBook(id)
      .then(({ data }) => setSource(data))
      .catch(() => { toast.error('Source not found'); navigate('/library'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStartSession = async (mode) => {
    setStartingSession(true);
    try {
      const { data } = await createLearnSession({
        topic:      `Deep dive into: ${source.title}`,
        mode:       mode || selectedMode,
        source_ids: [id],
      });
      navigate(`/learn/${data.id}`);
    } catch {
      toast.error('Failed to start session');
      setStartingSession(false);
    }
  };

  if (loading) return (
    <div className="ds-page-loading">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="ds-spinner" />
      </div>
    </div>
  );

  if (!source) return null;

  const genreConf  = getGenreConfig(source.genre) || {};
  const coverColor = source.cover_color || genreConf.color || '#1a3a5c';
  const modeConf   = LEARNING_MODES.find(m => m.id === selectedMode) || LEARNING_MODES[0];

  return (
    <div className="ds-page">
      <Navbar />

      {/* ── Hero gradient header ── */}
      <div
        className="border-b border-[#eceae4] px-6 py-8"
        style={{ background: `linear-gradient(180deg, ${coverColor}22 0%, #f7f4ed 100%)` }}
      >
        <div className="max-w-[900px] mx-auto">
          <button onClick={() => navigate(-1)} className="ds-back-btn mb-6">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="grid gap-8" style={{ gridTemplateColumns: '160px 1fr' }}>
            {/* Book cover slab */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="w-[160px] h-[220px] rounded-xl flex-shrink-0 flex items-end p-3"
              style={{
                background:  `linear-gradient(160deg, ${coverColor}ee 0%, ${coverColor}66 100%)`,
                boxShadow:   `0 16px 48px ${coverColor}44`,
              }}
            >
              <p className="text-[12px] font-bold text-white/90 leading-snug line-clamp-3">
                {source.title}
              </p>
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06, ease: EASE_OUT }}
            >
              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-3">
                {source.source_type && (
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{
                      background: `${SOURCE_TYPE_COLORS[source.source_type] || '#5f5f5d'}18`,
                      color:       SOURCE_TYPE_COLORS[source.source_type] || '#5f5f5d',
                    }}
                  >
                    {source.source_type}
                  </span>
                )}
                {genreConf.label && (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${genreConf.color || '#5f5f5d'}15`, color: genreConf.color || '#5f5f5d' }}
                  >
                    {genreConf.label}
                  </span>
                )}
              </div>

              <h1 className="text-[28px] font-bold text-[#1c1c1c] leading-tight mb-2">{source.title}</h1>
              <p className="text-[16px] text-[#5f5f5d] mb-4">by {source.author || 'Unknown Author'}</p>

              {source.summary && (
                <p className="text-[14px] text-[#5f5f5d] leading-[1.7] mb-5 max-w-[560px]">
                  {source.summary}
                </p>
              )}

              {/* Quick stats */}
              {(source.word_count > 0 || source.total_chunks > 0 || source.chapter_breakdown?.length > 0) && (
                <div className="flex gap-6 flex-wrap mb-6">
                  {source.word_count > 0 && (
                    <div>
                      <p className="text-[20px] font-bold text-[#1c1c1c]">{Math.round(source.word_count / 250)}</p>
                      <p className="text-[12px] text-[#8f8a80]">pages</p>
                    </div>
                  )}
                  {source.total_chunks > 0 && (
                    <div>
                      <p className="text-[20px] font-bold text-[#1c1c1c]">{source.total_chunks}</p>
                      <p className="text-[12px] text-[#8f8a80]">chunks indexed</p>
                    </div>
                  )}
                  {source.chapter_breakdown?.length > 0 && (
                    <div>
                      <p className="text-[20px] font-bold text-[#1c1c1c]">{source.chapter_breakdown.length}</p>
                      <p className="text-[12px] text-[#8f8a80]">chapters</p>
                    </div>
                  )}
                </div>
              )}

              {/* Primary CTAs */}
              <div className="flex gap-2 flex-wrap mb-3">
                <motion.button
                  onClick={() => handleStartSession(selectedMode)}
                  disabled={startingSession || source.status !== 'ready'}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  className="ds-btn ds-btn-amber"
                  style={{ opacity: startingSession ? 0.7 : 1 }}
                >
                  {startingSession ? 'Starting…' : `Start ${modeConf.label} session →`}
                </motion.button>
                <motion.button
                  onClick={() => navigate(`/book/${id}`)}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  className="ds-btn ds-btn-ghost"
                >
                  <BookOpen size={14} /> Read
                </motion.button>
              </div>

              {/* Mode picker */}
              <div className="flex gap-1.5 flex-wrap">
                {LEARNING_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className="text-[11px] px-2.5 py-1 rounded-full border cursor-pointer
                               transition-all duration-150"
                    style={{
                      border:     `1px solid ${selectedMode === mode.id ? mode.color : '#eceae4'}`,
                      background: selectedMode === mode.id ? `${mode.color}15` : 'transparent',
                      color:      selectedMode === mode.id ? mode.color : '#5f5f5d',
                      fontWeight: selectedMode === mode.id ? 600 : 400,
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Body content ── */}
      <div className="max-w-[900px] mx-auto px-6 py-8 grid gap-8"
           style={{ gridTemplateColumns: '1fr 280px' }}>

        {/* Left column */}
        <div className="flex flex-col gap-6">

          {/* Chapters */}
          {source.chapter_breakdown?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-[#1c1c1c]">Chapters</h2>
                <button
                  onClick={() => setExpandChapters(!expandChapters)}
                  className="text-[12px] text-[#5f5f5d] hover:text-[#1c1c1c] bg-transparent border-none
                             cursor-pointer flex items-center gap-1 transition-colors duration-150"
                >
                  {expandChapters
                    ? <><ChevronUp size={12} /> Collapse</>
                    : <><ChevronDown size={12} /> Show all</>}
                </button>
              </div>
              <div className="flex flex-col gap-0.5">
                {(expandChapters
                  ? source.chapter_breakdown
                  : source.chapter_breakdown.slice(0, 5)
                ).map((ch, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 bg-[#fbf9f3] rounded-md mb-0.5"
                    style={{ borderLeft: `3px solid ${coverColor}` }}
                  >
                    <p className="text-[13px] font-semibold text-[#1c1c1c]">
                      {ch.chapter || `Chapter ${i + 1}`}
                    </p>
                    {ch.summary && (
                      <p className="text-[12px] text-[#5f5f5d] mt-0.5 leading-relaxed">{ch.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key passages */}
          {source.key_quotes?.length > 0 && (
            <section>
              <h2 className="text-[16px] font-bold text-[#1c1c1c] mb-3">Key passages</h2>
              <div className="flex flex-col gap-3">
                {source.key_quotes.slice(0, 4).map((quote, i) => (
                  <blockquote key={i} className="m-0 px-4 py-3 border-l-[3px] border-[#f5a623] bg-[#fbf9f3] rounded-r-lg">
                    <p className="text-[14px] text-[#1c1c1c] leading-[1.7] italic">
                      "{typeof quote === 'string' ? quote : (quote.quote || quote.text || '')}"
                    </p>
                    {typeof quote !== 'string' && quote.speaker && (
                      <p className="text-[12px] text-[#8f8a80] mt-1.5">— {quote.speaker}</p>
                    )}
                  </blockquote>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">
          {source.themes?.length > 0 && (
            <section className="ds-card-sm">
              <h3 className="ds-label mb-2.5">Themes</h3>
              <div className="flex flex-wrap gap-1.5">
                {source.themes.map((theme, i) => (
                  <span key={i} className="text-[12px] px-2.5 py-1 rounded-full bg-[#f3efe4] text-[#5f5f5d]">
                    {typeof theme === 'string' ? theme : (theme.name || theme.label || '')}
                  </span>
                ))}
              </div>
            </section>
          )}

          {source.key_frameworks?.length > 0 && (
            <section className="ds-card-sm">
              <h3 className="ds-label mb-2.5">Frameworks</h3>
              <div className="flex flex-col gap-1.5">
                {source.key_frameworks.slice(0, 5).map((fw, i) => (
                  <p key={i} className="text-[13px] text-[#5f5f5d] pl-2 border-l-2 border-[#f5a623] leading-snug">
                    {typeof fw === 'string' ? fw : (fw.name || fw.label || '')}
                  </p>
                ))}
              </div>
            </section>
          )}

          {source.tags?.length > 0 && (
            <section className="ds-card-sm">
              <h3 className="ds-label mb-2.5">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {source.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-[#1c1c1c] text-[#f7f4ed] flex items-center gap-1">
                    <Tag size={9} /> {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {source.source_url && (
            <a
              href={source.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-[#4a6fa5] no-underline
                         px-3.5 py-2.5 bg-[#fbf9f3] border border-[#eceae4] rounded-lg
                         hover:border-[#4a6fa550] hover:bg-[#4a6fa508] transition-all duration-150"
            >
              <ExternalLink size={13} /> View original source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
