import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, ArrowLeft, Sparkles, Trash2, Download, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { getInsights, createLearnSession } from '../lib/api.js';
import toast from 'react-hot-toast';

const IDEA_CATEGORIES = [
  { id: 'product', label: 'Product', color: '#4a6fa5' },
  { id: 'service', label: 'Service', color: '#2d9b6f' },
  { id: 'event', label: 'Event', color: '#7b5ea7' },
  { id: 'program', label: 'Learning program', color: '#f5a623' },
  { id: 'business', label: 'Business model', color: '#a05c2e' },
];

export default function BuilderStudio() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('builder_ideas') || '[]'); } catch { return []; }
  });
  const [principles, setPrinciples] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', principle: '', category: 'product', notes: '' });
  const [selectedPrinciple, setSelectedPrinciple] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('builder_ideas', JSON.stringify(ideas)); } catch {}
  }, [ideas]);

  useEffect(() => {
    getInsights('principle')
      .then(res => setPrinciples(res.data?.insights || res.data || []))
      .catch(() => {});
  }, []);

  const addIdea = () => {
    if (!newIdea.title.trim()) return toast.error('Give your idea a name');
    const idea = { ...newIdea, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setIdeas(prev => [idea, ...prev]);
    setNewIdea({ title: '', principle: '', category: 'product', notes: '' });
    setShowAddForm(false);
    toast.success('Idea saved to Studio');
  };

  const removeIdea = (id) => setIdeas(prev => prev.filter(i => i.id !== id));

  const startBuilderSession = async () => {
    if (!selectedPrinciple.trim()) return toast.error('Enter a principle to build on');
    setStarting(true);
    try {
      const { data } = await createLearnSession({ topic: selectedPrinciple, mode: 'builder', source_ids: [] });
      navigate(`/learn/${data.id}`);
    } catch {
      toast.error('Failed to start Builder session');
      setStarting(false);
    }
  };

  const exportIdeas = () => {
    const lines = ideas.map(i => `## ${i.title}\nCategory: ${i.category}\nPrinciple: ${i.principle}\n${i.notes ? `Notes: ${i.notes}` : ''}\n`).join('\n---\n');
    const blob = new Blob([`# Builder Studio Export\n\n${lines}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'builder-ideas.md'; a.click();
    URL.revokeObjectURL(url);
  };

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
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#a05c2e20', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #a05c2e50' }}>
                  <Building2 size={18} style={{ color: '#a05c2e' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Builder Studio</h1>
              </div>
              <p style={{ fontSize: '14px', color: '#8f8a80', maxWidth: '480px' }}>
                Translate principles from your canon into products, services, and businesses.
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

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
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
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {IDEA_CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setNewIdea(p => ({ ...p, category: cat.id }))}
                          style={{ padding: '5px 12px', borderRadius: '999px', border: `1px solid ${newIdea.category === cat.id ? cat.color : '#eceae4'}`, background: newIdea.category === cat.id ? `${cat.color}15` : 'transparent', color: newIdea.category === cat.id ? cat.color : '#5f5f5d', fontSize: '12px', fontWeight: newIdea.category === cat.id ? 600 : 400, cursor: 'pointer' }}>
                          {cat.label}
                        </button>
                      ))}
                    </div>
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

          {ideas.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', background: '#fbf9f3', borderRadius: '16px', border: '2px dashed #eceae4' }}>
              <Building2 size={32} style={{ color: '#d6d2c7' }} />
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#8f8a80' }}>No ideas yet</p>
              <p style={{ fontSize: '13px', color: '#8f8a80' }}>Add your first idea or start a Builder session</p>
              <button onClick={() => setShowAddForm(true)} style={{ padding: '8px 18px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                + Add first idea
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {ideas.map(idea => {
                const cat = IDEA_CATEGORIES.find(c => c.id === idea.category) || IDEA_CATEGORIES[0];
                return (
                  <motion.div key={idea.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ background: '#fbf9f3', border: '1px solid #eceae4', borderRadius: '12px', padding: '16px', borderTop: `3px solid ${cat.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: cat.color }}>{cat.label}</span>
                      <button onClick={() => removeIdea(idea.id)} style={{ color: '#d6d2c7', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1c1c1c', marginBottom: '6px', lineHeight: 1.3 }}>{idea.title}</p>
                    {idea.principle && <p style={{ fontSize: '12px', color: '#a9690f', fontStyle: 'italic', marginBottom: '6px' }}>← {idea.principle}</p>}
                    {idea.notes && <p style={{ fontSize: '12px', color: '#5f5f5d', lineHeight: 1.5 }}>{idea.notes}</p>}
                    <button onClick={() => setSelectedPrinciple(idea.principle || idea.title)}
                      style={{ marginTop: '10px', fontSize: '11px', fontWeight: 600, color: cat.color, background: `${cat.color}10`, border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
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
            <p style={{ fontSize: '12px', color: '#5f5f5d', marginBottom: '16px', lineHeight: 1.5 }}>Pick a principle and let AI help you build from it.</p>
            <textarea
              value={selectedPrinciple}
              onChange={e => setSelectedPrinciple(e.target.value)}
              placeholder="Enter a principle or question..."
              rows={4}
              style={{ width: '100%', padding: '10px', border: '1px solid #eceae4', borderRadius: '8px', fontSize: '13px', resize: 'vertical', background: '#f7f4ed', color: '#1c1c1c', lineHeight: 1.5, boxSizing: 'border-box', marginBottom: '10px', outline: 'none' }}
            />
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
              style={{ width: '100%', padding: '11px', background: '#a05c2e', color: '#fbf9f3', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: starting || !selectedPrinciple.trim() ? 'default' : 'pointer', opacity: starting || !selectedPrinciple.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Sparkles size={15} />
              {starting ? 'Starting...' : 'Build with AI →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
