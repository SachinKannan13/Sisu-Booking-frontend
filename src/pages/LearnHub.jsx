import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getBooksSlim, getSessions, createLearnSession } from '../lib/api.js';
import { LEARNING_MODES, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import toast from 'react-hot-toast';

function ModeTile({ mode, selected, onSelect }) {
  const Icon = mode.icon;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
        padding: '16px', borderRadius: '12px', width: '100%', textAlign: 'left',
        border: `1px solid ${selected ? mode.color : '#eceae4'}`,
        background: selected ? `${mode.color}10` : '#fbf9f3',
        cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${mode.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} style={{ color: mode.color }} />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1c1c1c', marginBottom: '2px' }}>{mode.label}</p>
        <p style={{ fontSize: '12px', color: '#5f5f5d', lineHeight: 1.4 }}>{mode.description}</p>
      </div>
    </motion.button>
  );
}

function relativeTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

export default function LearnHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [selectedMode, setSelectedMode] = useState(location.state?.mode || null);
  const [sources, setSources] = useState([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [booksRes, sessionsRes] = await Promise.all([getBooksSlim(), getSessions()]);
      setSources((booksRes.data || []).filter(b => b.status === 'ready'));
      setSessions(sessionsRes.data || []);
    } catch {
      toast.error('Failed to load your knowledge base');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggleSource = (id) => {
    setSelectedSourceIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleStart = async () => {
    if (!topic.trim()) return toast.error('Enter a topic or question first');
    if (!selectedMode) return toast.error('Choose a learning mode');
    setCreating(true);
    try {
      const { data } = await createLearnSession({ topic: topic.trim(), mode: selectedMode, source_ids: selectedSourceIds });
      navigate(`/learn/${data.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to start session');
      setCreating(false);
    }
  };

  const canStart = topic.trim().length > 0 && selectedMode !== null;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed', paddingBottom: '80px' }}>
      <Navbar />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={() => navigate('/library')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5f5f5d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1c1c1c' }}>Start a learning session</h1>
        </div>

        {/* Step 1: Topic */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            Step 1 — Topic or question
          </label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. How does deep work relate to deliberate practice?"
            rows={3}
            style={{ width: '100%', background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '12px', padding: '16px', fontSize: '15px', color: '#1c1c1c', resize: 'none', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
          />
        </div>

        {/* Step 2: Mode */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            Step 2 — Choose your approach
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {LEARNING_MODES.map(mode => (
              <ModeTile key={mode.id} mode={mode} selected={selectedMode === mode.id} onSelect={() => setSelectedMode(mode.id)} />
            ))}
          </div>
        </div>

        {/* Step 3: Sources */}
        {!loading && sources.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Step 3 — Sources (optional — default = all)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sources.map(s => {
                const selected = selectedSourceIds.includes(s.id);
                const color = SOURCE_TYPE_COLORS[s.source_type] || '#5f5f5d';
                return (
                  <button key={s.id} onClick={() => toggleSource(s.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${selected ? color : '#eceae4'}`,
                      background: selected ? `${color}12` : '#fbf9f3',
                      color: selected ? color : '#5f5f5d' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    {s.title}
                    {selected && <X size={11} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Begin button */}
        <motion.button
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.98 } : {}}
          disabled={creating || !canStart}
          onClick={handleStart}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', background: canStart ? '#f5a623' : '#eceae4', color: canStart ? '#1c1c1c' : '#8f8a80', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: canStart ? 'pointer' : 'default', transition: 'all 0.2s' }}
        >
          {creating ? 'Starting session...' : 'Begin session'}
          {!creating && <ArrowRight size={18} />}
        </motion.button>

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Recent sessions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {sessions.map(s => {
                const modeConf = LEARNING_MODES.find(m => m.id === s.mode);
                const Icon = modeConf?.icon;
                return (
                  <motion.div key={s.id} whileHover={{ y: -2 }} onClick={() => navigate(`/learn/${s.id}`)}
                    style={{ background: '#fbf9f3', borderLeft: `4px solid ${modeConf?.color || '#eceae4'}`, borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid #eceae4` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      {Icon && <Icon size={13} style={{ color: modeConf.color }} />}
                      <span style={{ fontSize: '11px', fontWeight: 700, color: modeConf?.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {modeConf?.label || s.mode}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1c1c1c', lineHeight: 1.4, marginBottom: '8px',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {s.topic}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#8f8a80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {relativeTime(s.updated_at)}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#f5a623' }}>Continue →</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
