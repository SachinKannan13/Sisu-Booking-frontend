import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Plus, ArrowLeft, Sparkles, Trash2, Download, ChevronRight, BookOpen, Clapperboard } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getInsights, createLearnSession, runSimulation } from '../lib/api.js';
import { useApp as useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import supabase from '../lib/supabase.js';
import SimulationView from '../features/simulation/SimulationView.jsx';

// ── Lenses — must match server/prompts/learningModePrompts.js ──────
const LENSES = [
  { id: 'life',          label: 'Life & Living',       color: '#2d6a4f', desc: 'How to live this idea day to day' },
  { id: 'relationships', label: 'Relationships',        color: '#7b5ea7', desc: 'How it changes the way you relate to others' },
  { id: 'habits',        label: 'Habits & Self',        color: '#1a3a5c', desc: 'The personal practices it calls for' },
  { id: 'career',        label: 'Career & Work',        color: '#4a6fa5', desc: 'How it shapes your professional path' },
  { id: 'creativity',    label: 'Creativity & Making',  color: '#c85250', desc: 'How it fuels creative work' },
  { id: 'community',     label: 'Community & Society',  color: '#5a8a60', desc: 'How it plays out collectively' },
  { id: 'business',      label: 'Business & Venture',   color: '#a05c2e', desc: 'Products, services, and market opportunities' },
];

function LensSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        Apply this through the lens of
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {LENSES.map(lens => (
          <button
            key={lens.id}
            onClick={() => onChange(lens.id)}
            title={lens.desc}
            style={{
              padding: '5px 11px',
              borderRadius: '999px',
              border: `1px solid ${value === lens.id ? lens.color : '#eceae4'}`,
              background: value === lens.id ? `${lens.color}15` : 'transparent',
              color: value === lens.id ? lens.color : '#5f5f5d',
              fontSize: '12px',
              fontWeight: value === lens.id ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {lens.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BuilderStudio() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [principles, setPrinciples] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', principle: '', lens: 'life', notes: '' });
  const [selectedPrinciple, setSelectedPrinciple] = useState('');
  const [selectedLens, setSelectedLens] = useState('life');
  const [starting, setStarting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulation, setSimulation] = useState(null); // SimulationResult | null

  // ── Load ideas from Supabase ──────────────────────────────────────
  const loadIdeas = useCallback(async () => {
    if (!user?.id) return;
    setIdeasLoading(true);
    try {
      const { data, error } = await supabase
        .from('builder_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        // Table may not exist yet (migration pending) — fall back to localStorage
        const local = JSON.parse(localStorage.getItem('builder_ideas') || '[]');
        setIdeas(local);
      } else {
        setIdeas(data || []);
        // Sync legacy localStorage ideas to DB if any exist
        const local = JSON.parse(localStorage.getItem('builder_ideas') || '[]');
        if (local.length && (!data || data.length === 0)) {
          for (const idea of local) {
            await supabase.from('builder_ideas').insert({
              user_id: user.id,
              title: idea.title,
              principle: idea.principle || '',
              lens: idea.category || 'life',
              notes: idea.notes || '',
            }).select().single();
          }
          localStorage.removeItem('builder_ideas');
          loadIdeas();
        }
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('builder_ideas') || '[]');
      setIdeas(local);
    } finally {
      setIdeasLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadIdeas(); }, [loadIdeas]);

  useEffect(() => {
    getInsights('principle')
      .then(res => setPrinciples(res.data?.insights || res.data || []))
      .catch(() => {});
  }, []);

  const addIdea = async () => {
    if (!newIdea.title.trim()) return toast.error('Give your idea a name');
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('builder_ideas')
          .insert({ user_id: user.id, title: newIdea.title, principle: newIdea.principle, lens: newIdea.lens, notes: newIdea.notes })
          .select().single();
        if (error) throw error;
        setIdeas(prev => [data, ...prev]);
      } else {
        // Unauthenticated fallback — localStorage only
        const idea = { ...newIdea, id: Date.now().toString(), created_at: new Date().toISOString() };
        const updated = [idea, ...ideas];
        setIdeas(updated);
        localStorage.setItem('builder_ideas', JSON.stringify(updated));
      }
      setNewIdea({ title: '', principle: '', lens: 'life', notes: '' });
      setShowAddForm(false);
      toast.success('Idea saved');
    } catch {
      toast.error('Could not save idea');
    }
  };

  const removeIdea = async (id) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
    if (user?.id) {
      await supabase.from('builder_ideas').delete().eq('id', id).eq('user_id', user.id);
    }
  };

  const startBuilderSession = async () => {
    if (!selectedPrinciple.trim()) return toast.error('Enter a principle to build on');
    setStarting(true);
    try {
      const { data } = await createLearnSession({ topic: selectedPrinciple, mode: 'builder', source_ids: [], lens: selectedLens });
      navigate(`/learn/${data.id}`);
    } catch {
      toast.error('Failed to start Builder session');
      setStarting(false);
    }
  };

  const exportIdeas = () => {
    const lines = ideas.map(i => `## ${i.title}\nLens: ${i.lens}\nPrinciple: ${i.principle}\n${i.notes ? `Notes: ${i.notes}` : ''}`).join('\n\n---\n\n');
    const blob = new Blob([`# Builder Studio Export\n\n${lines}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'builder-ideas.md'; a.click();
    URL.revokeObjectURL(url);
  };

  const runSim = async () => {
    if (!selectedPrinciple.trim()) return toast.error('Enter a principle to simulate');
    setSimulating(true);
    try {
      const { data } = await runSimulation({ principle: selectedPrinciple.trim(), lens: selectedLens });
      setSimulation(data.simulation);
    } catch (err) {
      toast.error(err.message || 'Simulation failed — please try again');
    } finally {
      setSimulating(false);
    }
  };

  const handleSendToLab = (experiment) => {
    setSimulation(null);
    navigate('/lab', { state: { prefillExperiment: experiment } });
  };

  const activeLens = LENSES.find(l => l.id === selectedLens) || LENSES[0];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed', paddingBottom: '80px' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: '#1c1c1c', color: '#fbf9f3', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => navigate('/library')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8f8a80', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5a62320', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f5a62350' }}>
                  <Lightbulb size={18} style={{ color: '#f5a623' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Builder Studio</h1>
              </div>
              <p style={{ fontSize: '14px', color: '#8f8a80', maxWidth: '520px' }}>
                Take a principle from any book and see how it applies to your life — across any lens: relationships, habits, creativity, work, or business.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {ideas.length > 0 && (
                <button onClick={exportIdeas} style={{ padding: '8px 16px', background: 'transparent', color: '#8f8a80', border: '1px solid #444', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={13} /> Export
                </button>
              )}
              <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '8px 16px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={14} /> Add idea
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Ideas */}
        <div>
          <AnimatePresence>
            {showAddForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '16px', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1c1c1c', marginBottom: '16px' }}>New idea</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input placeholder="Idea name" value={newIdea.title} onChange={e => setNewIdea(p => ({ ...p, title: e.target.value }))}
                      style={{ padding: '10px 14px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '14px', background: '#f7f4ed', outline: 'none' }} />
                    <LensSelector value={newIdea.lens} onChange={lens => setNewIdea(p => ({ ...p, lens }))} />
                    <input placeholder="Principle from your canon (optional)" value={newIdea.principle} onChange={e => setNewIdea(p => ({ ...p, principle: e.target.value }))}
                      style={{ padding: '10px 14px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '14px', background: '#f7f4ed', outline: 'none' }} />
                    <textarea placeholder="Notes, early thinking..." value={newIdea.notes} onChange={e => setNewIdea(p => ({ ...p, notes: e.target.value }))} rows={3}
                      style={{ padding: '10px 14px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '14px', background: '#f7f4ed', resize: 'vertical', outline: 'none' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={addIdea} style={{ padding: '10px 20px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save idea</button>
                      <button onClick={() => setShowAddForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#5f5f5d', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {ideasLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#8f8a80', fontSize: '14px' }}>Loading ideas…</div>
          ) : ideas.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', background: '#fbf9f3', borderRadius: '16px', border: '2px dashed #eceae4' }}>
              <BookOpen size={32} style={{ color: '#d6d2c7' }} />
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#8f8a80' }}>No ideas yet</p>
              <p style={{ fontSize: '13px', color: '#8f8a80', textAlign: 'center', maxWidth: '260px' }}>
                Pick any book — philosophy, fantasy, peace, thriller — and apply its ideas to your life.
              </p>
              <button onClick={() => setShowAddForm(true)} style={{ padding: '8px 18px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                + Add first idea
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {ideas.map(idea => {
                const lensConfig = LENSES.find(l => l.id === idea.lens) || LENSES[0];
                return (
                  <motion.div key={idea.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '12px', padding: '16px', borderTop: `3px solid ${lensConfig.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: lensConfig.color }}>{lensConfig.label}</span>
                      <button onClick={() => removeIdea(idea.id)} style={{ color: '#d6d2c7', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1c1c1c', marginBottom: '6px', lineHeight: 1.3 }}>{idea.title}</p>
                    {idea.principle && <p style={{ fontSize: '12px', color: '#a9690f', fontStyle: 'italic', marginBottom: '6px' }}>← {idea.principle}</p>}
                    {idea.notes && <p style={{ fontSize: '12px', color: '#5f5f5d', lineHeight: 1.5 }}>{idea.notes}</p>}
                    <button
                      onClick={() => { setSelectedPrinciple(idea.principle || idea.title); setSelectedLens(idea.lens || 'life'); }}
                      style={{ marginTop: '10px', fontSize: '11px', fontWeight: 600, color: lensConfig.color, background: `${lensConfig.color}10`, border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                      Build with AI →
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1c1c1c', marginBottom: '4px' }}>Start a Builder session</h3>
            <p style={{ fontSize: '12px', color: '#5f5f5d', marginBottom: '16px', lineHeight: 1.5 }}>
              Take any principle — from a peace novel, a philosophy text, or a fantasy epic — and see how it applies to your life.
            </p>
            <textarea
              value={selectedPrinciple}
              onChange={e => setSelectedPrinciple(e.target.value)}
              placeholder="Enter a principle or idea from any book..."
              rows={4}
              style={{ width: '100%', padding: '10px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '13px', resize: 'vertical', background: '#f7f4ed', color: '#1c1c1c', lineHeight: 1.5, boxSizing: 'border-box', marginBottom: '12px', outline: 'none' }}
            />
            <LensSelector value={selectedLens} onChange={setSelectedLens} />
            {principles.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>From your insights</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
                  {principles.slice(0, 6).map((p, i) => (
                    <button key={i} onClick={() => setSelectedPrinciple(p.content)}
                      style={{ textAlign: 'left', padding: '6px 10px', background: '#f3efe4', borderRadius: '6px', border: 'none', fontSize: '12px', color: '#5f5f5d', cursor: 'pointer', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ChevronRight size={10} style={{ flexShrink: 0 }} />
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.content}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={startBuilderSession}
              disabled={starting || !selectedPrinciple.trim()}
              style={{ width: '100%', padding: '11px', background: activeLens.color, color: '#fbf9f3', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: starting || !selectedPrinciple.trim() ? 'default' : 'pointer', opacity: starting || !selectedPrinciple.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s ease' }}
            >
              <Sparkles size={15} />
              {starting ? 'Starting…' : `Apply through ${activeLens.label} →`}
            </button>

            {/* ── Simulation CTA ── */}
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eceae4' }}>
              <button
                onClick={runSim}
                disabled={simulating || !selectedPrinciple.trim()}
                style={{ width: '100%', padding: '10px', background: '#1c1c1c', color: '#f5f0e8', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: simulating || !selectedPrinciple.trim() ? 'default' : 'pointer', opacity: simulating || !selectedPrinciple.trim() ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'opacity 0.2s ease' }}
              >
                <Clapperboard size={14} />
                {simulating ? 'Generating simulation…' : 'See it play out →'}
              </button>
              <p style={{ fontSize: '11px', color: '#8f8a80', textAlign: 'center', marginTop: '6px', lineHeight: 1.4 }}>
                Cinematic multi-beat story of living this principle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Simulation overlay ── */}
      <AnimatePresence>
        {simulation && (
          <SimulationView
            simulation={simulation}
            onClose={() => setSimulation(null)}
            onSendToLab={handleSendToLab}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
