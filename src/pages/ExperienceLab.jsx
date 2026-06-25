import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Sparkles, Play, Save, BookOpen, Plus, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Modal from '../components/ui/Modal.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card.jsx';
import { Badge } from '@/components/ui/shadcn/badge.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/shadcn/accordion.jsx';
import { Button } from '@/components/ui/shadcn/button.jsx';
import {
  designExperiment, saveExperiment, getExperiments,
  updateExperiment, captureExperimentLessons, addObservation
} from '../lib/api.js';
import toast from 'react-hot-toast';

// Module-level cache — survives tab switches
let _labCache = null;
let _labCacheTime = 0;
const LAB_CACHE_TTL = 20_000;

const TABS = [
  { id: 'design', label: 'Design' },
  { id: 'track', label: 'Track' }
];

const COLUMNS = [
  { id: 'designed',  label: 'Designed',  color: '#5f5f5d' },
  { id: 'running',   label: 'Running',   color: '#f5a623' },
  { id: 'completed', label: 'Completed', color: '#2d9b6f' },
  { id: 'abandoned', label: 'Abandoned', color: '#c85250' }
];

function ColumnCount({ count, color }) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '20px', height: '20px', borderRadius: '50%',
        background: color + '20', color, fontSize: '11px', fontWeight: 700
      }}
    >
      {count}
    </motion.span>
  );
}

export default function ExperienceLab() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('design');
  const [principle, setPrinciple] = useState('');
  const [draft, setDraft] = useState(location.state?.draft || null);
  const [sessionId] = useState(location.state?.sessionId || null);
  const [designing, setDesigning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [experiments, setExperiments] = useState(_labCache || []);
  const [loading, setLoading] = useState(!_labCache);
  const [captureTarget, setCaptureTarget] = useState(null);
  const [actualOutcome, setActualOutcome] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [observeTarget, setObserveTarget] = useState(null);
  const [newObservation, setNewObservation] = useState('');
  const [addingObs, setAddingObs] = useState(false);

  const fetchExperiments = useCallback(async (silent = false) => {
    if (!silent) setLoading(_labCache ? false : true);
    try {
      const { data } = await getExperiments();
      const list = data.experiments || [];
      _labCache = list;
      _labCacheTime = Date.now();
      setExperiments(list);
    } catch (_) {
      if (!silent) toast.error('Failed to load experiments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.draft) setActiveTab('design');
    if (_labCache && Date.now() - _labCacheTime < LAB_CACHE_TTL) {
      setLoading(false);
      fetchExperiments(true);
    } else {
      fetchExperiments(false);
    }
  }, [fetchExperiments, location.state]);

  const handleDesign = async () => {
    if (!principle.trim()) return toast.error('Describe the principle you want to test');
    setDesigning(true);
    try {
      const { data } = await designExperiment({ principle: principle.trim() });
      setDraft(data.experiment_draft);
    } catch (err) {
      toast.error(err.message || 'Failed to design experiment');
    } finally {
      setDesigning(false);
    }
  };

  const handleSaveToLab = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveExperiment({
        title: (draft.principle || principle).slice(0, 80),
        principle: draft.principle || principle,
        hypothesis: draft.hypothesis,
        variables: draft.variables,
        risks: draft.risks,
        success_measures: draft.success_measures,
        observation_method: draft.observation_method,
        predicted_outcome: draft.predicted_outcome,
        session_id: sessionId
      });
      toast.success('Saved to Lab');
      setDraft(null);
      setPrinciple('');
      setActiveTab('track');
      _labCache = null;
      fetchExperiments();
    } catch (err) {
      if (err.message?.includes('not set up')) {
        toast.error('Run migrations_009_experiments.sql in Supabase first');
      } else {
        toast.error(err.message || 'Failed to save experiment');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (exp, status) => {
    try {
      const { data } = await updateExperiment(exp.id, { status });
      setExperiments(prev => prev.map(e => e.id === exp.id ? data : e));
    } catch (err) {
      toast.error(err.message || 'Failed to update experiment');
    }
  };

  const openCapture = (exp) => {
    setCaptureTarget(exp);
    setActualOutcome(exp.actual_outcome || '');
    setLessonsLearned(exp.lessons_learned || '');
  };

  const handleCapture = async () => {
    if (!captureTarget) return;
    try {
      const { data } = await captureExperimentLessons(captureTarget.id, {
        actual_outcome: actualOutcome,
        lessons_learned: lessonsLearned
      });
      setExperiments(prev => prev.map(e => e.id === data.id ? data : e));
      toast.success('Lessons captured');
      setCaptureTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to capture lessons');
    }
  };

  const handleAddObservation = async () => {
    if (!newObservation.trim() || !observeTarget) return;
    setAddingObs(true);
    try {
      const { data } = await addObservation(observeTarget.id, newObservation.trim());
      setExperiments(prev => prev.map(e => e.id === data.id ? data : e));
      setObserveTarget(data);
      setNewObservation('');
      toast.success('Observation logged');
    } catch (err) {
      toast.error(err.message || 'Failed to log observation');
    } finally {
      setAddingObs(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-6">
          <FlaskConical size={22} className="text-[#2d6a8f]" />
          <h1 className="text-2xl font-bold text-[#1c1c1c]">Experience Lab</h1>
        </div>

        <div className="flex gap-1 mb-8 border-b border-[#eceae4]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ' +
                (activeTab === tab.id
                  ? 'text-[#f5a623] border-[#f5a623]'
                  : 'text-[#5f5f5d] border-transparent hover:text-[#1c1c1c]')
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'design' && (
          <div>
            <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-2 block">
              What principle do you want to test on yourself?
            </label>
            <textarea
              value={principle}
              onChange={(e) => setPrinciple(e.target.value)}
              placeholder="e.g. Time-boxing deep work sessions improves output quality"
              rows={3}
              className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-xl p-4 text-[#1c1c1c] text-sm placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50 resize-none mb-4"
            />
            <Button
              onClick={handleDesign}
              disabled={designing}
              className="bg-[#2d6a8f] hover:bg-[#245a78] text-white font-semibold h-10"
            >
              <Sparkles size={15} className="mr-2" />
              {designing ? 'Designing...' : 'Design Experiment'}
            </Button>

            {draft && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 space-y-4"
              >
                {/* Hypothesis */}
                {draft.hypothesis && (
                  <Card className="border-l-4 border-l-[#2d6a8f] bg-[#fbf9f3] border-y-[#eceae4] border-r-[#eceae4]">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs uppercase tracking-widest text-[#2d6a8f]">Hypothesis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#1c1c1c] text-sm leading-relaxed">{draft.hypothesis}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Variables grid */}
                {draft.variables?.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#5f5f5d] font-semibold mb-3">Variables</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {draft.variables.map((v, i) => (
                        <Card key={i} className="bg-[#fbf9f3] border-[#eceae4]">
                          <CardContent className="p-3">
                            <Badge
                              variant="outline"
                              className="text-[9px] uppercase mb-1.5"
                              style={{
                                color: v.type === 'independent' ? '#4a6fa5' : v.type === 'dependent' ? '#2d9b6f' : '#7b5ea7',
                                borderColor: v.type === 'independent' ? '#4a6fa540' : v.type === 'dependent' ? '#2d9b6f40' : '#7b5ea740'
                              }}
                            >
                              {v.type}
                            </Badge>
                            <p className="text-[#1c1c1c] text-xs font-semibold">{v.name}</p>
                            {v.description && <p className="text-[#8f8a80] text-xs mt-0.5 leading-relaxed">{v.description}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Predicted outcome */}
                {draft.predicted_outcome && (
                  <Card className="bg-[#f3efe4] border-[#eceae4]">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs uppercase tracking-widest text-[#5f5f5d]">Predicted Outcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#1c1c1c] text-sm leading-relaxed">{draft.predicted_outcome}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Success measures — collapsible */}
                {draft.success_measures?.length > 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="measures" className="border border-[#eceae4] rounded-xl overflow-hidden bg-[#fbf9f3]">
                      <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#5f5f5d] hover:no-underline hover:bg-[#f3efe4]">
                        Success Measures ({draft.success_measures.length})
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2 mt-2">
                          {draft.success_measures.map((s, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2d9b6f] mt-1.5 shrink-0" />
                              <p className="text-sm text-[#5f5f5d]">
                                {s.measure}
                                {s.how_to_observe && <span className="text-[#8f8a80]"> — {s.how_to_observe}</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* Risks — collapsible */}
                {draft.risks?.length > 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="risks" className="border border-[#eceae4] rounded-xl overflow-hidden bg-[#fbf9f3]">
                      <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#c85250] hover:no-underline hover:bg-[#f3efe4]">
                        Risks & Mitigations ({draft.risks.length})
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2 mt-2">
                          {draft.risks.map((r, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c85250] mt-1.5 shrink-0" />
                              <p className="text-sm text-[#5f5f5d]">
                                {typeof r === 'string' ? r : r.risk}
                                {r.mitigation && <span className="text-[#8f8a80]"> {r.mitigation}</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* First step today */}
                {draft.first_step_today && (
                  <Card className="bg-gradient-to-r from-[#fef3dc] to-[#fbf9f3] border-[#f5a623]/30">
                    <CardHeader className="pb-1 pt-3">
                      <CardTitle className="text-xs uppercase tracking-widest text-[#f5a623]">First Step Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#1c1c1c] text-sm leading-relaxed">{draft.first_step_today}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Save button */}
                <Button
                  onClick={handleSaveToLab}
                  disabled={saving}
                  className="w-full bg-[#f5a623] hover:bg-[#e09520] text-[#1c1c1c] font-semibold h-11 text-sm"
                >
                  <Save size={15} className="mr-2" />
                  {saving ? 'Saving to Lab...' : 'Save to Lab'}
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'track' && (
          loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
            </div>
          ) : (
            <div>
              {/* Summary bar */}
              <div className="flex gap-6 mb-6 p-4 bg-[#fbf9f3] rounded-xl border border-[#eceae4]">
                {COLUMNS.map(col => (
                  <div key={col.id} className="text-center">
                    <motion.p
                      key={experiments.filter(e => e.status === col.id).length}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold"
                      style={{ color: col.color }}
                    >
                      {experiments.filter(e => e.status === col.id).length}
                    </motion.p>
                    <p className="text-[10px] text-[#8f8a80] uppercase tracking-wider">{col.label}</p>
                  </div>
                ))}
              </div>

              {/* Kanban grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COLUMNS.map(col => {
                  const colExps = experiments.filter(e => e.status === col.id);
                  return (
                    <div key={col.id}>
                      <div className="flex items-center gap-2 mb-3">
                        <motion.span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: col.color }}
                          animate={col.id === 'running' ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: col.color }}>
                          {col.label}
                        </span>
                        <ColumnCount count={colExps.length} color={col.color} />
                      </div>

                      <div className="space-y-3 min-h-[120px]">
                        <AnimatePresence>
                          {colExps.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-2 border-dashed border-[#eceae4] rounded-xl py-8 text-center"
                            >
                              <p className="text-[#8f8a80] text-xs">Nothing here yet</p>
                            </motion.div>
                          ) : (
                            colExps.map(exp => (
                              <ExperimentCard
                                key={exp.id}
                                exp={exp}
                                navigate={navigate}
                                onStart={() => handleStatusChange(exp, 'running')}
                                onLog={() => setObserveTarget(exp)}
                                onComplete={() => openCapture(exp)}
                                onAbandon={() => handleStatusChange(exp, 'abandoned')}
                              />
                            ))
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </main>

      {/* Capture modal */}
      <Modal open={!!captureTarget} onClose={() => setCaptureTarget(null)} title="Capture Results" size="md">
        <div className="space-y-4">
          {captureTarget?.predicted_outcome && (
            <div className="bg-[#f7f4ed] rounded-xl p-3 border border-[#eceae4]">
              <p className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1">What you predicted</p>
              <p className="text-[#5f5f5d] text-sm italic">{captureTarget.predicted_outcome}</p>
            </div>
          )}
          <div>
            <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">What actually happened?</label>
            <textarea
              value={actualOutcome}
              onChange={(e) => setActualOutcome(e.target.value)}
              rows={3}
              className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-3 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50 resize-none"
              placeholder="Describe the actual outcome..."
            />
          </div>
          <div>
            <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">What did you learn?</label>
            <textarea
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              rows={3}
              className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-3 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50 resize-none"
              placeholder="This will be saved as an insight in your learning memory..."
            />
          </div>
          <button
            onClick={handleCapture}
            className="w-full bg-[#f5a623] text-[#1c1c1c] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e09520] transition-colors"
          >
            Save & Complete
          </button>
        </div>
      </Modal>

      {/* Observation journal modal */}
      <Modal
        open={!!observeTarget}
        onClose={() => { setObserveTarget(null); setNewObservation(''); }}
        title="Log Observation"
        size="md"
      >
        {observeTarget && (
          <div className="space-y-4">
            <p className="text-[#5f5f5d] text-xs font-medium">{observeTarget.title}</p>
            {Array.isArray(observeTarget.observations) && observeTarget.observations.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {observeTarget.observations.map((obs, i) => (
                  <div key={i} className="bg-[#f7f4ed] rounded-lg p-3 border border-[#eceae4]">
                    <p className="text-[#1c1c1c] text-sm">{obs.text}</p>
                    <p className="text-[#8f8a80] text-xs mt-1">{new Date(obs.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">New observation</label>
              <textarea
                value={newObservation}
                onChange={e => setNewObservation(e.target.value)}
                rows={3}
                placeholder="What did you observe or measure today?"
                className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-3 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50 resize-none"
              />
            </div>
            <button
              onClick={handleAddObservation}
              disabled={addingObs || !newObservation.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#f5a623] text-[#1c1c1c] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e09520] transition-colors disabled:opacity-50"
            >
              <Plus size={14} /> {addingObs ? 'Logging...' : 'Log Observation'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ExperimentCard({ exp, onStart, onLog, onComplete, onAbandon, navigate }) {
  const obsCount = Array.isArray(exp.observations) ? exp.observations.length : 0;
  const statusColor = { designed: '#5f5f5d', running: '#f5a623', completed: '#2d9b6f', abandoned: '#c85250' }[exp.status] || '#5f5f5d';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-[#fbf9f3] border-[#eceae4] overflow-hidden">
        {/* Status accent bar */}
        <div className="h-1 w-full" style={{ backgroundColor: statusColor }} />
        <CardContent className="p-3.5">
          <p className="text-[#1c1c1c] text-sm font-semibold leading-snug line-clamp-2 mb-1.5">{exp.title}</p>
          {exp.hypothesis && (
            <p className="text-[#5f5f5d] text-xs leading-relaxed line-clamp-2 mb-2">{exp.hypothesis}</p>
          )}

          {/* Running progress indicator */}
          {exp.status === 'running' && (
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-[#8f8a80] mb-1">
                <span>{obsCount} observation{obsCount !== 1 ? 's' : ''}</span>
                <span>{exp.success_measures?.length || 0} measures</span>
              </div>
              <div className="h-0.5 bg-[#eceae4] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#f5a623', width: '40%' }}
                  animate={{ x: ['0%', '180%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}

          {exp.status === 'completed' && exp.completed_at && (
            <div className="flex items-center gap-1 mb-2">
              <CheckCircle size={11} style={{ color: '#2d9b6f' }} />
              <span className="text-[10px] text-[#8f8a80]">
                Completed {new Date(exp.completed_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-1.5 flex-wrap">
            {exp.status === 'designed' && (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={onStart}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-colors"
                style={{ background: '#f5a62320', color: '#f5a623' }}
              >
                <Play size={9} /> Start
              </motion.button>
            )}
            {exp.status === 'running' && (
              <>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onLog}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: '#4a6fa520', color: '#4a6fa5' }}>
                  <BookOpen size={9} /> Log
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onComplete}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: '#2d9b6f20', color: '#2d9b6f' }}>
                  <CheckCircle size={9} /> Complete
                </motion.button>
                {navigate && (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/lab/' + exp.id + '/review')}
                    className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-semibold"
                    style={{ background: '#7b5ea720', color: '#7b5ea7' }}>
                    Review
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onAbandon}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: '#c8525015', color: '#c85250' }}>
                  <XCircle size={9} /> Abandon
                </motion.button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
