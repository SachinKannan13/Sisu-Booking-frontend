import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import TeacherProgress from '../components/learn/TeacherProgress.jsx';
import StructuredResponse from '../components/learn/StructuredResponse.jsx';
import { getLearnSession, askLearnSession, saveInsight, switchSessionMode } from '../lib/api.js';
import { LEARNING_MODES, MODE_BY_ID } from '../constants/learningModes.js';
import toast from 'react-hot-toast';

export default function LearningSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [asking, setAsking] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [modeSwitchOpen, setModeSwitchOpen] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);
  const scrollRef = useRef(null);
  const modeSwitchRef = useRef(null);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await getLearnSession(sessionId);
      setSession(data);
    } catch (err) {
      toast.error('Session not found');
      navigate('/learn');
    } finally {
      setLoading(false);
    }
  }, [sessionId, navigate]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [session?.messages?.length, streamingText]);

  // Close mode-switcher on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modeSwitchRef.current && !modeSwitchRef.current.contains(e.target)) {
        setModeSwitchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sendMessage = async (text) => {
    const message = (text ?? input).trim();
    if (!message || asking) return;

    setInput('');
    setAsking(true);
    setStreamingText('');

    // Optimistic append
    setSession(prev => ({
      ...prev,
      messages: [...(prev.messages || []), { role: 'user', content: message, created_at: new Date().toISOString() }]
    }));

    try {
      const { data } = await askLearnSession(
        sessionId,
        message,
        (delta) => setStreamingText(prev => prev + delta)
      );
      setStreamingText('');
      if (data?.session) setSession(data.session);
    } catch (err) {
      toast.error(err.message || 'Failed to get a response');
      // Roll back optimistic message on failure
      setSession(prev => ({ ...prev, messages: (prev.messages || []).slice(0, -1) }));
    } finally {
      setAsking(false);
      setStreamingText('');
    }
  };

  const handleSaveInsight = async (content) => {
    try {
      await saveInsight(sessionId, content, [], session?.source_ids || [], inferInsightType(session?.mode));
      toast.success('Saved to your learning memory');
    } catch (err) {
      if (err.message?.includes('not set up')) {
        toast.error('Run migrations_010_memory.sql in Supabase first');
      } else {
        toast.error(err.message || 'Failed to save insight');
      }
    }
  };

  const handleSwitchMode = async (newMode) => {
    if (newMode === session?.mode || switchingMode) return;
    setSwitchingMode(true);
    setModeSwitchOpen(false);
    try {
      const { data } = await switchSessionMode(sessionId, newMode);
      setSession(data);
      toast.success(`Switched to ${MODE_BY_ID[newMode]?.label || newMode} mode`);
    } catch (err) {
      toast.error(err.message || 'Failed to switch mode');
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleSessionComplete = () => {
    // Navigate to Memory after a short delay so the user can read the toast
    setTimeout(() => navigate('/memory'), 2000);
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const modeInfo = MODE_BY_ID[session.mode];
  const messages = session.messages || [];

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
      <Navbar />

      {/* Session progress strip */}
      <div style={{ background: `${modeInfo?.color || '#f5a623'}12`, borderBottom: '1px solid #eceae4', padding: '6px 24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#5f5f5d' }}>
        <span style={{ fontWeight: 600, color: modeInfo?.color || '#f5a623', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{modeInfo?.label || session?.mode} session</span>
        <span>·</span>
        <span>{session?.messages?.filter(m => m.role === 'user').length || 0} questions asked</span>
        {session?.source_ids?.length > 0 && <><span>·</span><span>{session.source_ids.length} source{session.source_ids.length !== 1 ? 's' : ''}</span></>}
      </div>

      {/* Header */}
      <div className="flex-shrink-0 border-b border-[#eceae4] px-6 py-4" style={{ borderTop: `2px solid ${modeInfo?.color || '#f5a623'}` }}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/learn')}
            className="text-[#5f5f5d] hover:text-[#1c1c1c] mt-1 transition-colors p-1 rounded-lg hover:bg-[#fbf9f3]"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mode Switcher */}
              <div ref={modeSwitchRef} className="relative">
                <button
                  onClick={() => setModeSwitchOpen(!modeSwitchOpen)}
                  disabled={switchingMode}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ color: modeInfo?.color, borderColor: `${modeInfo?.color}40`, backgroundColor: `${modeInfo?.color}10` }}
                >
                  {modeInfo && <modeInfo.icon size={11} />}
                  {switchingMode ? 'Switching...' : (modeInfo?.label || session.mode)}
                  <ChevronDown size={11} />
                </button>

                <AnimatePresence>
                  {modeSwitchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.96 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-1.5 bg-[#fbf9f3] border border-[#eceae4] rounded-xl shadow-lg z-50 min-w-[200px] overflow-hidden"
                    >
                      {LEARNING_MODES.map(m => {
                        const active = m.id === session.mode;
                        return (
                          <button
                            key={m.id}
                            onClick={() => handleSwitchMode(m.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                              active ? 'bg-[#f7f4ed]' : 'hover:bg-[#f7f4ed]'
                            }`}
                          >
                            <m.icon size={13} style={{ color: m.color }} />
                            <div>
                              <span className={`font-medium ${active ? '' : 'text-[#1c1c1c]'}`} style={active ? { color: m.color } : {}}>
                                {m.label}
                              </span>
                              {active && <span className="text-[10px] text-[#8f8a80] ml-1">current</span>}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <h1 className="text-lg font-bold text-[#1c1c1c] mt-1 line-clamp-1">{session.topic}</h1>
          </div>
        </div>
      </div>

      {session.mode === 'teacher' && <TeacherProgress currentStep={session.loop_step || 0} />}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-[#8f8a80] text-sm py-12">
              Ask your first question to begin this {modeInfo?.label.toLowerCase()} session.
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === 'user' ? 'flex justify-end' : ''}
            >
              {m.role === 'user' ? (
                <div className="bg-[#fbf9f3] text-[#1c1c1c] text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                  {m.content}
                </div>
              ) : (
                <div className="bg-[#fbf9f3] border border-[#eceae4] rounded-2xl rounded-tl-sm p-5">
                  <StructuredResponse
                    mode={session.mode}
                    output={m.content}
                    onAskFollowup={sendMessage}
                    onSaveInsight={handleSaveInsight}
                    sessionId={session.id}
                    onSessionComplete={handleSessionComplete}
                  />
                </div>
              )}
            </motion.div>
          ))}

          {asking && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#fbf9f3] border border-[#eceae4] rounded-2xl rounded-tl-sm p-5"
              style={{ borderTop: `2px solid ${modeInfo?.color || '#f5a623'}40` }}
            >
              {/* Mode label */}
              <div className="flex items-center gap-2 mb-4">
                {modeInfo && <modeInfo.icon size={12} style={{ color: modeInfo.color }} />}
                <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: modeInfo?.color || '#f5a623' }}>
                  {modeInfo?.label || session.mode}
                </span>
                <div className="flex gap-1 ml-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="block w-1 h-1 rounded-full"
                      style={{ backgroundColor: modeInfo?.color || '#f5a623', animation: 'bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
              {/* Skeleton lines */}
              <div className="space-y-2.5">
                <div className="h-3 rounded-full bg-[#eceae4] animate-pulse" style={{ width: '92%' }} />
                <div className="h-3 rounded-full bg-[#eceae4] animate-pulse" style={{ width: '78%', animationDelay: '0.1s' }} />
                <div className="h-3 rounded-full bg-[#eceae4] animate-pulse" style={{ width: '85%', animationDelay: '0.2s' }} />
                <div className="h-3 rounded-full bg-[#eceae4] animate-pulse" style={{ width: '60%', animationDelay: '0.3s' }} />
              </div>
              <p className="text-[#8f8a80] text-xs mt-3">{streamingText ? 'Generating response…' : 'Thinking across your sources…'}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-[#eceae4] bg-[#fbf9f3] px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-white rounded-2xl border border-[#eceae4] p-2 shadow-sm focus-within:border-[#f5a623]/50 transition-colors">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Ask a question in ${modeInfo?.label || ''} mode...`}
              rows={1}
              className="flex-1 bg-transparent text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none resize-none max-h-32 overflow-y-auto px-2 py-1.5"
              style={{ minHeight: '36px' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={asking || !input.trim()}
              className="rounded-xl w-9 h-9 shrink-0 bg-[#f5a623] hover:bg-[#e09520] text-[#1c1c1c] flex items-center justify-center transition-colors disabled:opacity-30"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-[10px] text-[#8f8a80] mt-1.5 pl-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}

function inferInsightType(mode) {
  const map = {
    scholar: 'observation',
    critic: 'reflection',
    synthesizer: 'framework',
    practitioner: 'principle',
    teacher: 'observation',
    experiment: 'experiment_result',
    builder: 'framework'
  };
  return map[mode] || 'observation';
}
