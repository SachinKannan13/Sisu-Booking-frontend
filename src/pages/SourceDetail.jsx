import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Tag, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getBook, createLearnSession } from '../lib/api.js';
import { LEARNING_MODES, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import { getGenreConfig } from '../utils/genreConfig.js';
import toast from 'react-hot-toast';

export default function SourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [selectedMode, setSelectedMode] = useState('scholar');
  const [expandChapters, setExpandChapters] = useState(false);

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
        topic: `Deep dive into: ${source.title}`,
        mode: mode || selectedMode,
        source_ids: [id]
      });
      navigate(`/learn/${data.id}`);
    } catch {
      toast.error('Failed to start session');
      setStartingSession(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(245,166,35,0.2)', borderTopColor: '#f5a623', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </div>
  );

  if (!source) return null;

  const genreConf = getGenreConfig(source.genre) || {};
  const coverColor = source.cover_color || genreConf.color || '#1a3a5c';
  const modeConf = LEARNING_MODES.find(m => m.id === selectedMode) || LEARNING_MODES[0];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed', paddingBottom: '80px' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, ${coverColor}22 0%, #f7f4ed 100%)`, borderBottom: '1px solid #eceae4', padding: '32px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5f5f5d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '24px' }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '32px', alignItems: 'flex-start' }}>
            {/* Cover */}
            <div style={{ width: '160px', height: '220px', borderRadius: '12px', background: `linear-gradient(160deg, ${coverColor}ee 0%, ${coverColor}66 100%)`, boxShadow: `0 16px 48px ${coverColor}44`, display: 'flex', alignItems: 'flex-end', padding: '12px', flexShrink: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>{source.title}</p>
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {source.source_type && (
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: `${SOURCE_TYPE_COLORS[source.source_type] || '#5f5f5d'}18`, color: SOURCE_TYPE_COLORS[source.source_type] || '#5f5f5d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {source.source_type}
                  </span>
                )}
                {genreConf.label && (
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: `${genreConf.color || '#5f5f5d'}15`, color: genreConf.color || '#5f5f5d' }}>
                    {genreConf.label}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1c1c1c', lineHeight: 1.2, marginBottom: '8px' }}>{source.title}</h1>
              <p style={{ fontSize: '16px', color: '#5f5f5d', marginBottom: '16px' }}>by {source.author || 'Unknown Author'}</p>

              {source.summary && (
                <p style={{ fontSize: '14px', color: '#5f5f5d', lineHeight: 1.7, marginBottom: '20px', maxWidth: '560px' }}>{source.summary}</p>
              )}

              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {source.word_count > 0 && (
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#1c1c1c' }}>{Math.round(source.word_count / 250)}</p>
                    <p style={{ fontSize: '12px', color: '#8f8a80' }}>pages</p>
                  </div>
                )}
                {source.total_chunks > 0 && (
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#1c1c1c' }}>{source.total_chunks}</p>
                    <p style={{ fontSize: '12px', color: '#8f8a80' }}>chunks indexed</p>
                  </div>
                )}
                {source.chapter_breakdown?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#1c1c1c' }}>{source.chapter_breakdown.length}</p>
                    <p style={{ fontSize: '12px', color: '#8f8a80' }}>chapters</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <button
                  onClick={() => handleStartSession(selectedMode)}
                  disabled={startingSession || source.status !== 'ready'}
                  style={{ padding: '10px 24px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', opacity: startingSession ? 0.7 : 1 }}
                >
                  {startingSession ? 'Starting...' : `Start ${modeConf.label} session →`}
                </button>
                <button
                  onClick={() => navigate(`/book/${id}`)}
                  style={{ padding: '10px 20px', background: '#fbf9f3', color: '#1c1c1c', border: '1px solid #eceae4', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <BookOpen size={14} /> Read
                </button>
              </div>

              {/* Mode pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {LEARNING_MODES.map(mode => (
                  <button key={mode.id} onClick={() => setSelectedMode(mode.id)}
                    style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '999px',
                      border: `1px solid ${selectedMode === mode.id ? mode.color : '#eceae4'}`,
                      background: selectedMode === mode.id ? `${mode.color}15` : 'transparent',
                      color: selectedMode === mode.id ? mode.color : '#5f5f5d',
                      cursor: 'pointer', fontWeight: selectedMode === mode.id ? 600 : 400 }}>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Chapters */}
          {source.chapter_breakdown?.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1c1c' }}>Chapters</h2>
                <button onClick={() => setExpandChapters(!expandChapters)} style={{ fontSize: '12px', color: '#5f5f5d', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {expandChapters ? <><ChevronUp size={12} /> Collapse</> : <><ChevronDown size={12} /> Show all</>}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {(expandChapters ? source.chapter_breakdown : source.chapter_breakdown.slice(0, 5)).map((ch, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: '#fbf9f3', borderRadius: '6px', borderLeft: `3px solid ${coverColor}`, marginBottom: '2px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1c1c1c' }}>{ch.chapter || `Chapter ${i + 1}`}</p>
                    {ch.summary && <p style={{ fontSize: '12px', color: '#5f5f5d', marginTop: '2px', lineHeight: 1.5 }}>{ch.summary}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key quotes */}
          {source.key_quotes?.length > 0 && (
            <section>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1c1c', marginBottom: '12px' }}>Key passages</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {source.key_quotes.slice(0, 4).map((quote, i) => (
                  <blockquote key={i} style={{ margin: 0, padding: '12px 16px', borderLeft: '3px solid #f5a623', background: '#fbf9f3', borderRadius: '0 8px 8px 0' }}>
                    <p style={{ fontSize: '14px', color: '#1c1c1c', lineHeight: 1.7, fontStyle: 'italic' }}>"{typeof quote === 'string' ? quote : (quote.quote || quote.text || '')}"</p>
                    {typeof quote !== 'string' && quote.speaker && (
                      <p style={{ fontSize: '12px', color: '#8f8a80', marginTop: '6px' }}>— {quote.speaker}</p>
                    )}
                  </blockquote>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {source.themes?.length > 0 && (
            <section style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1c1c1c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Themes</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {source.themes.map((theme, i) => (
                  <span key={i} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '999px', background: '#f3efe4', color: '#5f5f5d' }}>
                    {typeof theme === 'string' ? theme : (theme.name || theme.label || '')}
                  </span>
                ))}
              </div>
            </section>
          )}

          {source.key_frameworks?.length > 0 && (
            <section style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1c1c1c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Frameworks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {source.key_frameworks.slice(0, 5).map((fw, i) => (
                  <p key={i} style={{ fontSize: '13px', color: '#5f5f5d', paddingLeft: '8px', borderLeft: '2px solid #f5a623' }}>
                    {typeof fw === 'string' ? fw : (fw.name || fw.label || '')}
                  </p>
                ))}
              </div>
            </section>
          )}

          {source.tags?.length > 0 && (
            <section style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1c1c1c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {source.tags.map((tag, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', background: '#1c1c1c', color: '#f7f4ed', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Tag size={9} /> {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {source.source_url && (
            <a href={source.source_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4a6fa5', textDecoration: 'none', padding: '10px 14px', background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '8px' }}>
              <ExternalLink size={13} /> View original source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
