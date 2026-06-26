import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Save, FlaskConical } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getExperiments, reviewExperiment, captureExperimentLessons } from '../lib/api.js';
import toast from 'react-hot-toast';

const EASE_OUT = [0.23, 1, 0.32, 1];

export default function ExperimentReview() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [experiment,     setExperiment]     = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [actualOutcome,  setActualOutcome]  = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [aiAnalysis,     setAiAnalysis]     = useState(null);
  const [reviewing,      setReviewing]      = useState(false);
  const [saving,         setSaving]         = useState(false);

  useEffect(() => {
    getExperiments()
      .then(({ data }) => {
        const exp = (data.experiments || []).find(e => e.id === id);
        if (!exp) { toast.error('Experiment not found'); navigate('/lab'); return; }
        setExperiment(exp);
        setActualOutcome(exp.actual_outcome || '');
      })
      .catch(() => navigate('/lab'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async () => {
    if (!actualOutcome.trim()) return toast.error('Describe what actually happened');
    setReviewing(true);
    try {
      const { data } = await reviewExperiment(id, { actual_outcome: actualOutcome });
      setAiAnalysis(data);
    } catch {
      toast.error('AI analysis unavailable — you can still save manually');
    } finally {
      setReviewing(false);
    }
  };

  const handleSave = async () => {
    if (!lessonsLearned.trim() && !actualOutcome.trim()) return toast.error('Add what you learned');
    setSaving(true);
    try {
      await captureExperimentLessons(id, {
        actual_outcome:  actualOutcome,
        lessons_learned: lessonsLearned || aiAnalysis?.lesson || '',
        status:          'completed',
      });
      toast.success('Experiment completed and lessons saved!');
      navigate('/lab');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
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

  if (!experiment) return null;

  return (
    <div className="ds-page">
      <Navbar />

      <div className="ds-constrained page-enter">
        {/* Back */}
        <button onClick={() => navigate('/lab')} className="ds-back-btn mb-6">
          <ArrowLeft size={14} /> Back to Lab
        </button>

        {/* Experiment header card */}
        <div className="ds-card mb-5">
          <h1 className="text-[22px] font-bold text-[#1c1c1c] mb-4 leading-tight">
            {experiment.title || experiment.principle}
          </h1>

          {experiment.hypothesis && (
            <div className="ds-insight-block mb-3">
              <p className="ds-label mb-1">Hypothesis</p>
              <p className="text-[14px] text-[#1c1c1c] leading-relaxed">{experiment.hypothesis}</p>
            </div>
          )}

          {experiment.predicted_outcome && (
            <div className="bg-[#4a6fa508] border-l-[3px] border-[#4a6fa5] rounded-r-lg px-4 py-3">
              <p className="ds-label mb-1" style={{ color: '#4a6fa5' }}>Predicted outcome</p>
              <p className="text-[14px] text-[#1c1c1c] leading-relaxed">{experiment.predicted_outcome}</p>
            </div>
          )}
        </div>

        {/* What actually happened */}
        <div className="ds-card mb-4">
          <h2 className="text-[16px] font-bold text-[#1c1c1c] mb-1">What actually happened?</h2>
          <p className="text-[13px] text-[#5f5f5d] mb-4">Be specific — compare against your hypothesis.</p>
          <textarea
            value={actualOutcome}
            onChange={e => setActualOutcome(e.target.value)}
            placeholder="I ran the experiment for… What I actually observed was…"
            rows={5}
            className="w-full p-3 border border-[#eceae4] rounded-lg text-[14px] resize-y
                       bg-[#f7f4ed] text-[#1c1c1c] leading-relaxed outline-none
                       focus:border-[#d6d2c7] transition-colors duration-150 box-border"
          />
          <motion.button
            onClick={handleReview}
            disabled={reviewing || !actualOutcome.trim()}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            className="mt-3 ds-btn ds-btn-dark"
            style={{ opacity: (!actualOutcome.trim() || reviewing) ? 0.45 : 1 }}
          >
            <FlaskConical size={14} />
            {reviewing ? 'Analysing…' : 'Get AI analysis →'}
          </motion.button>
        </div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="ds-card mb-4"
          >
            <h2 className="text-[16px] font-bold text-[#1c1c1c] mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-[#f5a623]" />
              AI Analysis
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#4a6fa510] rounded-lg p-3">
                <p className="ds-label mb-1.5" style={{ color: '#4a6fa5' }}>Predicted</p>
                <p className="text-[13px] text-[#1c1c1c] leading-relaxed">{experiment.predicted_outcome || '—'}</p>
              </div>
              <div className="bg-[#2d9b6f10] rounded-lg p-3">
                <p className="ds-label mb-1.5" style={{ color: '#2d9b6f' }}>Actual</p>
                <p className="text-[13px] text-[#1c1c1c] leading-relaxed">{actualOutcome}</p>
              </div>
            </div>

            {aiAnalysis.gap_analysis && (
              <div className="ds-insight-block mb-3">
                <p className="ds-label mb-1">Gap analysis</p>
                <p className="text-[13px] text-[#1c1c1c] leading-relaxed">{aiAnalysis.gap_analysis}</p>
              </div>
            )}

            {aiAnalysis.lesson && (
              <div className="bg-[#fef3dc] border-l-[3px] border-[#f5a623] rounded-r-lg px-4 py-3">
                <p className="ds-label mb-1" style={{ color: '#a9690f' }}>Distilled lesson</p>
                <p className="text-[13px] text-[#1c1c1c] leading-relaxed">{aiAnalysis.lesson}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Lessons learned */}
        <div className="ds-card mb-5">
          <h2 className="text-[16px] font-bold text-[#1c1c1c] mb-1">Your lessons learned</h2>
          <p className="text-[13px] text-[#5f5f5d] mb-3">What will you do differently?</p>
          <textarea
            value={lessonsLearned}
            onChange={e => setLessonsLearned(e.target.value)}
            placeholder={aiAnalysis?.lesson || "What I'll take away from this is…"}
            rows={4}
            className="w-full p-3 border border-[#eceae4] rounded-lg text-[14px] resize-y
                       bg-[#f7f4ed] text-[#1c1c1c] leading-relaxed outline-none
                       focus:border-[#d6d2c7] transition-colors duration-150 box-border"
          />
        </div>

        {/* Complete CTA */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          className="w-full ds-btn ds-btn-amber rounded-xl"
          style={{ padding: '14px', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Complete experiment and save lessons'}
        </motion.button>
      </div>
    </div>
  );
}
