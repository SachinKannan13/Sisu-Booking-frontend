import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getBooksSlim, getSessions, createLearnSession } from '../lib/api.js';
import { LEARNING_MODES, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import toast from 'react-hot-toast';

const EASE_OUT = [0.23, 1, 0.32, 1];

// ── Mode tile — selected state driven purely by props ─────────────────
function ModeTile({ mode, selected, onSelect, index }) {
  const Icon = mode.icon;
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: EASE_OUT }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      onClick={onSelect}
      className="flex flex-col items-start gap-2 p-4 rounded-xl w-full text-left cursor-pointer
                 transition-all duration-200"
      style={{
        border:     `1px solid ${selected ? mode.color : '#eceae4'}`,
        background: selected ? `${mode.color}10` : '#fbf9f3',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${mode.color}20` }}
      >
        <Icon size={18} style={{ color: mode.color }} />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#1c1c1c] mb-0.5">{mode.label}</p>
        <p className="text-[12px] text-[#5f5f5d] leading-snug">{mode.description}</p>
      </div>
    </motion.button>
  );
}

function relativeTime(dateStr) {
  const d    = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

// ── Step label ────────────────────────────────────────────────────────
function StepLabel({ children }) {
  return (
    <label className="block text-[12px] font-bold text-[#f5a623] uppercase tracking-[0.08em] mb-2.5">
      {children}
    </label>
  );
}

export default function LearnHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const [topic,             setTopic]             = useState(location.state?.topic || '');
  const [selectedMode,      setSelectedMode]      = useState(location.state?.mode || null);
  const [sources,           setSources]           = useState([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState([]);
  const [sessions,          setSessions]          = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [creating,          setCreating]          = useState(false);

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
    setSelectedSourceIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleStart = async () => {
    if (!topic.trim())  return toast.error('Enter a topic or question first');
    if (!selectedMode)  return toast.error('Choose a learning mode');
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
    <div className="ds-page">
      <Navbar />

      <div className="max-w-[860px] mx-auto px-6 py-8 page-enter">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/library')} className="ds-back-btn mb-0">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-[22px] font-bold text-[#1c1c1c]">Start a learning session</h1>
        </div>

        {/* Step 1 — Topic */}
        <div className="mb-8">
          <StepLabel>Step 1 — Topic or question</StepLabel>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. How does deep work relate to deliberate practice?"
            rows={3}
            className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-xl px-4 py-4
                       text-[15px] text-[#1c1c1c] resize-none outline-none leading-relaxed
                       focus:border-[#d6d2c7] transition-colors duration-150 box-border"
          />
        </div>

        {/* Step 2 — Mode */}
        <div className="mb-8">
          <StepLabel>Step 2 — Choose your approach</StepLabel>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {LEARNING_MODES.map((mode, i) => (
              <ModeTile
                key={mode.id}
                mode={mode}
                index={i}
                selected={selectedMode === mode.id}
                onSelect={() => setSelectedMode(mode.id)}
              />
            ))}
          </div>
        </div>

        {/* Step 3 — Sources */}
        {!loading && sources.length > 0 && (
          <div className="mb-8">
            <StepLabel>Step 3 — Sources (optional — default = all)</StepLabel>
            <div className="flex flex-wrap gap-2">
              {sources.map(s => {
                const selected = selectedSourceIds.includes(s.id);
                const color    = SOURCE_TYPE_COLORS[s.source_type] || '#5f5f5d';
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSource(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px]
                               cursor-pointer transition-all duration-150"
                    style={{
                      border:     `1px solid ${selected ? color : '#eceae4'}`,
                      background: selected ? `${color}12` : '#fbf9f3',
                      color:      selected ? color : '#5f5f5d',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    {s.title}
                    {selected && <X size={11} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Begin CTA */}
        <motion.button
          whileTap={canStart ? { scale: 0.97 } : {}}
          transition={{ duration: 0.1 }}
          disabled={creating || !canStart}
          onClick={handleStart}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl
                     font-bold text-[16px] border-none cursor-pointer transition-all duration-200"
          style={{
            background: canStart ? '#f5a623' : '#eceae4',
            color:      canStart ? '#1c1c1c' : '#8f8a80',
            cursor:     canStart ? 'pointer' : 'default',
          }}
        >
          {creating ? 'Starting session…' : 'Begin session'}
          {!creating && <ArrowRight size={18} />}
        </motion.button>

        {/* Recent sessions — staggered entrance */}
        {sessions.length > 0 && (
          <div className="mt-12">
            <h2 className="ds-label mb-4">Recent sessions</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {sessions.map((s, i) => {
                const modeConf = LEARNING_MODES.find(m => m.id === s.mode);
                const Icon     = modeConf?.icon;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05, ease: EASE_OUT }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    onClick={() => navigate(`/learn/${s.id}`)}
                    className="bg-[#fbf9f3] rounded-[10px] p-4 cursor-pointer transition-all duration-200
                               border border-[#eceae4] hover:border-[#d6d2c7] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                    style={{ borderLeft: `4px solid ${modeConf?.color || '#eceae4'}` }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {Icon && <Icon size={13} style={{ color: modeConf.color }} />}
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: modeConf?.color }}
                      >
                        {modeConf?.label || s.mode}
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#1c1c1c] leading-snug mb-2 line-clamp-2">
                      {s.topic}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#8f8a80] flex items-center gap-1">
                        <Clock size={10} /> {relativeTime(s.updated_at)}
                      </span>
                      <span className="text-[11px] font-semibold text-[#f5a623]">Continue →</span>
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
