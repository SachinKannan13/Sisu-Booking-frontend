import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Save, FlaskConical } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getExperiments, reviewExperiment, captureExperimentLessons } from '../lib/api.js';
import toast from 'react-hot-toast';

export default function ExperimentReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualOutcome, setActualOutcome] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [saving, setSaving] = useState(false);

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
        actual_outcome: actualOutcome,
        lessons_learned: lessonsLearned || aiAnalysis?.lesson || '',
        status: 'completed'
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
    <div style={{ minHeight: '100vh', background: '#f7f4ed' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(245,166,35,0.2)', borderTopColor: '#f5a623', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </div>
  );

  if (!experiment) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed', paddingBottom: '80px' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={() => navigate('/lab')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5f5f5d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '24px' }}>
          <ArrowLeft size={14} /> Back to Lab
        </button>

        {/* Experiment card */}
        <div style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1c1c1c', marginBottom: '16px' }}>{experiment.title || experiment.principle}</h1>

          {experiment.hypothesis && (
            <div style={{ marginBottom: '12px', padding: '12px 16px', background: '#f3efe4', borderRadius: '8px', borderLeft: '3px solid #f5a623' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Hypothesis</p>
              <p style={{ fontSize: '14px', color: '#1c1c1c', lineHeight: 1.6 }}>{experiment.hypothesis}</p>
            </div>
          )}

          {experiment.predicted_outcome && (
            <div style={{ padding: '12px 16px', background: '#4a6fa508', borderRadius: '8px', borderLeft: '3px solid #4a6fa5' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Predicted outcome</p>
              <p style={{ fontSize: '14px', color: '#1c1c1c', lineHeight: 1.6 }}>{experiment.predicted_outcome}</p>
            </div>
          )}
        </div>

        {/* Actual outcome */}
        <div style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1c1c', marginBottom: '4px' }}>What actually happened?</h2>
          <p style={{ fontSize: '13px', color: '#5f5f5d', marginBottom: '16px' }}>Be specific — compare against your hypothesis.</p>
          <textarea
            value={actualOutcome}
            onChange={e => setActualOutcome(e.target.value)}
            placeholder="I ran the experiment for... What I actually observed was..."
            rows={5}
            style={{ width: '100%', padding: '12px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '14px', resize: 'vertical', background: '#f7f4ed', color: '#1c1c1c', lineHeight: 1.6, boxSizing: 'border-box' }}
          />
          <button
            onClick={handleReview}
            disabled={reviewing || !actualOutcome.trim()}
            style={{ marginTop: '12px', padding: '10px 20px', background: reviewing ? '#8f8a80' : '#1c1c1c', color: '#fbf9f3', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: reviewing ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: !actualOutcome.trim() ? 0.5 : 1 }}
          >
            <FlaskConical size={14} />
            {reviewing ? 'Analyzing...' : 'Get AI analysis →'}
          </button>
        </div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1c1c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={16} style={{ color: '#f5a623' }} /> AI Analysis
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: '#4a6fa510', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6fa5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Predicted</p>
                <p style={{ fontSize: '13px', color: '#1c1c1c', lineHeight: 1.5 }}>{experiment.predicted_outcome || '—'}</p>
              </div>
              <div style={{ padding: '12px', background: '#2d9b6f10', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2d9b6f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Actual</p>
                <p style={{ fontSize: '13px', color: '#1c1c1c', lineHeight: 1.5 }}>{actualOutcome}</p>
              </div>
            </div>

            {aiAnalysis.gap_analysis && (
              <div style={{ padding: '12px 16px', background: '#f3efe4', borderRadius: '8px', borderLeft: '3px solid #f5a623', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Gap analysis</p>
                <p style={{ fontSize: '13px', color: '#1c1c1c', lineHeight: 1.6 }}>{aiAnalysis.gap_analysis}</p>
              </div>
            )}
            {aiAnalysis.lesson && (
              <div style={{ padding: '12px 16px', background: '#fef3dc', borderRadius: '8px', borderLeft: '3px solid #f5a623' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#a9690f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Distilled lesson</p>
                <p style={{ fontSize: '13px', color: '#1c1c1c', lineHeight: 1.6 }}>{aiAnalysis.lesson}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Lessons */}
        <div style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1c1c', marginBottom: '4px' }}>Your lessons learned</h2>
          <p style={{ fontSize: '13px', color: '#5f5f5d', marginBottom: '12px' }}>What will you do differently?</p>
          <textarea
            value={lessonsLearned}
            onChange={e => setLessonsLearned(e.target.value)}
            placeholder={aiAnalysis?.lesson || "What I'll take away from this is..."}
            rows={4}
            style={{ width: '100%', padding: '12px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '14px', resize: 'vertical', background: '#f7f4ed', color: '#1c1c1c', lineHeight: 1.6, boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', padding: '14px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: saving ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Complete experiment and save lessons'}
        </button>
      </div>
    </div>
  );
}
