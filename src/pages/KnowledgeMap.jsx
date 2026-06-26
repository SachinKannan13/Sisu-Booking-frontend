import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import ConceptGraph from '../components/learn/ConceptGraph.jsx';
import { getConcepts, getInsights } from '../lib/api.js';
import toast from 'react-hot-toast';

const EASE_OUT = [0.23, 1, 0.32, 1];

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const [concepts,     setConcepts]     = useState({ nodes: [], edges: [] });
  const [insights,     setInsights]     = useState([]);
  const [loading,      setLoading]      = useState(true);
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
    ? insights.filter(ins =>
        ins.tags?.includes(selectedNode.label) ||
        ins.content?.toLowerCase().includes(selectedNode.label?.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col">
      <Navbar />

      {/* Sub-header */}
      <div className="px-6 py-3 border-b border-[#eceae4] flex items-center gap-4">
        <button onClick={() => navigate('/memory')} className="ds-back-btn mb-0">
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="text-[18px] font-bold text-[#1c1c1c] leading-tight">Knowledge Map</h1>
          <p className="text-[12px] text-[#8f8a80]">
            {concepts.nodes?.length || 0} concepts · {concepts.edges?.length || 0} connections
          </p>
        </div>
      </div>

      {/* Main grid — panel slides in when a node is selected */}
      <div
        className="flex-1 grid transition-all duration-[250ms]"
        style={{ gridTemplateColumns: selectedNode ? '1fr 320px' : '1fr' }}
      >
        {/* Graph area */}
        <div className="p-6 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="ds-spinner" />
            </div>
          ) : concepts.nodes?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="flex flex-col items-center justify-center h-[400px] gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-[#fef3dc] flex items-center justify-center">
                <Share2 size={24} className="text-[#f5a623]" />
              </div>
              <p className="text-[16px] font-semibold text-[#1c1c1c]">Your knowledge map is empty</p>
              <p className="text-[14px] text-[#5f5f5d] text-center max-w-[320px] leading-relaxed">
                Complete a few learning sessions and save insights — concepts will start linking together.
              </p>
              <motion.button
                onClick={() => navigate('/learn')}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                className="mt-1 ds-btn ds-btn-amber"
              >
                Start learning →
              </motion.button>
            </motion.div>
          ) : (
            <div className="bg-[#fbf9f3] rounded-2xl border border-[#eceae4] overflow-hidden">
              <ConceptGraph onNodeSelect={setSelectedNode} />
            </div>
          )}
        </div>

        {/* Node detail panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="border-l border-[#eceae4] bg-[#fbf9f3] p-6 overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-[16px] font-bold text-[#1c1c1c] leading-snug pr-4">
                  {selectedNode.label}
                </h2>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[#8f8a80] hover:text-[#1c1c1c] bg-transparent border-none
                             cursor-pointer p-0.5 rounded transition-colors duration-150 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {selectedNode.description && (
                <p className="text-[13px] text-[#5f5f5d] leading-relaxed mb-4">
                  {selectedNode.description}
                </p>
              )}

              {nodeInsights.length > 0 && (
                <div>
                  <p className="ds-label mb-2">Related insights ({nodeInsights.length})</p>
                  <div className="flex flex-col gap-1.5">
                    {nodeInsights.slice(0, 5).map((ins, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04, ease: EASE_OUT }}
                        className="bg-[#f3efe4] rounded-lg p-2.5"
                      >
                        <p className="text-[12px] text-[#1c1c1c] leading-relaxed">{ins.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                onClick={() => navigate('/learn', { state: { topic: selectedNode.label } })}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                className="mt-5 w-full ds-btn ds-btn-amber text-[13px]"
              >
                Explore "{selectedNode.label}" →
              </motion.button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
