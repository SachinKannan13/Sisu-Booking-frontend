import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import ConceptGraph from '../components/learn/ConceptGraph.jsx';
import { getConcepts, getInsights } from '../lib/api.js';
import toast from 'react-hot-toast';

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const [concepts, setConcepts] = useState({ nodes: [], edges: [] });
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    Promise.all([getConcepts(), getInsights()])
      .then(([cRes, iRes]) => {
        setConcepts(cRes.data || { nodes: [], edges: [] });
        setInsights(iRes.data?.insights || iRes.data || []);
      })
      .catch(() => toast.error('Failed to load knowledge map'))
      .finally(() => setLoading(false));
  }, []);

  const nodeInsights = selectedNode
    ? insights.filter(ins => ins.tags?.includes(selectedNode.label) || ins.content?.toLowerCase().includes(selectedNode.label?.toLowerCase()))
    : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ed', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #eceae4', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/memory')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5f5f5d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1c1c' }}>Knowledge Map</h1>
          <p style={{ fontSize: '12px', color: '#8f8a80' }}>
            {concepts.nodes?.length || 0} concepts · {concepts.edges?.length || 0} connections
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedNode ? '1fr 320px' : '1fr', transition: 'all 0.25s' }}>
        <div style={{ padding: '24px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(245,166,35,0.2)', borderTopColor: '#f5a623', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : concepts.nodes?.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '12px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef3dc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={24} style={{ color: '#f5a623' }} />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1c1c1c' }}>Your knowledge map is empty</p>
              <p style={{ fontSize: '14px', color: '#5f5f5d', textAlign: 'center', maxWidth: '320px' }}>
                Complete a few learning sessions and save insights — concepts will start linking together.
              </p>
              <button onClick={() => navigate('/learn')} style={{ padding: '10px 20px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Start learning →
              </button>
            </div>
          ) : (
            <div style={{ background: '#fbf9f3', borderRadius: '16px', border: '1px solid #eceae4', overflow: 'hidden' }}>
              <ConceptGraph />
            </div>
          )}
        </div>

        {selectedNode && (
          <div style={{ borderLeft: '1px solid #eceae4', padding: '24px', overflowY: 'auto', background: '#fbf9f3' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1c1c' }}>{selectedNode.label}</h2>
              <button onClick={() => setSelectedNode(null)} style={{ color: '#8f8a80', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            {selectedNode.description && (
              <p style={{ fontSize: '13px', color: '#5f5f5d', lineHeight: 1.6, marginBottom: '16px' }}>{selectedNode.description}</p>
            )}
            {nodeInsights.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#8f8a80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Related insights ({nodeInsights.length})
                </p>
                {nodeInsights.slice(0, 5).map((ins, i) => (
                  <div key={i} style={{ padding: '10px', background: '#f3efe4', borderRadius: '8px', marginBottom: '6px' }}>
                    <p style={{ fontSize: '12px', color: '#1c1c1c', lineHeight: 1.5 }}>{ins.content}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/learn', { state: { topic: selectedNode.label } })}
              style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#f5a623', color: '#1c1c1c', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Explore "{selectedNode.label}" →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
