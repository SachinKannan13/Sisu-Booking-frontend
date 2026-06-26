import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Lightbulb, FlaskConical, Share2,
  Library as LibraryIcon, Search, X, ArrowRight,
  Clapperboard, TrendingUp
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import ConceptGraph from '../components/learn/ConceptGraph.jsx';
import { getInsights, getExperiments, getBooksSlim, getConcepts } from '../lib/api.js';
import { INSIGHT_COLORS, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import toast from 'react-hot-toast';

const EASE_OUT = [0.23, 1, 0.32, 1];

// Module-level cache — survives tab switches
let _memCache    = null;
let _memCacheTime = 0;
const MEM_CACHE_TTL = 20_000;

const STATUS_COLORS = {
  designed: '#5f5f5d', running: '#f5a623', completed: '#2d9b6f', abandoned: '#c85250'
};

const TABS = [
  { id: 'overview',     label: 'Overview',        icon: TrendingUp  },
  { id: 'insights',     label: 'Insights',         icon: Lightbulb   },
  { id: 'experiments',  label: 'Experiments',      icon: FlaskConical},
  { id: 'graph',        label: 'Knowledge Graph',  icon: Share2      },
  { id: 'library',      label: 'Library',          icon: LibraryIcon },
];

function relativeTime(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
}

// ── Stat card ─────────────────────────────────────────────────────────
function StatCard({ value, label, color, icon: Icon, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: EASE_OUT }}
      onClick={onClick}
      className={`ds-card flex items-center gap-4 ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={onClick ? { y: -2, transition: { duration: 0.15 } } : {}}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-[24px] font-bold text-[#1c1c1c] leading-none">{value}</p>
        <p className="text-[12px] text-[#8f8a80] mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Insight card ──────────────────────────────────────────────────────
function InsightCard({ insight, index, onTagClick }) {
  const color = INSIGHT_COLORS[insight.insight_type] || '#5f5f5d';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: EASE_OUT }}
      className="ds-card"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] uppercase font-bold tracking-wider"
          style={{ color }}
        >
          {insight.insight_type.replace(/_/g, ' ')}
        </span>
        <span className="text-[11px] text-[#8f8a80]">{relativeTime(insight.created_at)}</span>
      </div>
      <p className="text-[14px] text-[#1c1c1c] leading-[1.7]">{insight.content}</p>
      {insight.tags?.length > 0 && (
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {insight.tags.map((t, j) => (
            <button
              key={j}
              onClick={() => onTagClick?.(t)}
              className="text-[10px] text-[#8f8a80] border border-[#eceae4] rounded-full
                         px-2 py-0.5 hover:border-[#f5a623]/40 hover:text-[#f5a623]
                         transition-colors duration-150 bg-transparent cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function LearningMemory() {
  const navigate   = useNavigate();
  const cached     = _memCache || { insights: [], experiments: [], sources: [], concepts: { nodes: [], edges: [] } };
  const [activeTab,        setActiveTab]        = useState('overview');
  const [insights,         setInsights]         = useState(cached.insights);
  const [insightFilter,    setInsightFilter]    = useState(null);
  const [insightSearch,    setInsightSearch]    = useState('');
  const [experiments,      setExperiments]      = useState(cached.experiments);
  const [sources,          setSources]          = useState(cached.sources);
  const [concepts,         setConcepts]         = useState(cached.concepts);
  const [sourceTypeFilter, setSourceTypeFilter] = useState(null);
  const [loading,          setLoading]          = useState(!_memCache);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(!_memCache);
    try {
      const [insR, expR, srcR, conR] = await Promise.all([
        getInsights().catch(() => ({ data: { insights: [] } })),
        getExperiments().catch(() => ({ data: { experiments: [] } })),
        getBooksSlim().catch(() => ({ data: [] })),
        getConcepts().catch(() => ({ data: { nodes: [], edges: [] } })),
      ]);
      const next = {
        insights:  insR.data?.insights || insR.data || [],
        experiments: expR.data?.experiments || expR.data || [],
        sources:   srcR.data || [],
        concepts:  conR.data || { nodes: [], edges: [] },
      };
      _memCache     = next;
      _memCacheTime = Date.now();
      setInsights(next.insights);
      setExperiments(next.experiments);
      setSources(next.sources);
      setConcepts(next.concepts);
    } catch (_) {
      if (!silent) toast.error('Failed to load learning memory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (_memCache && Date.now() - _memCacheTime < MEM_CACHE_TTL) {
      setLoading(false);
      fetchAll(true);
    } else {
      fetchAll(false);
    }
  }, [fetchAll]);

  // ── Derived data ─────────────────────────────────────────────────────
  const insightTypes = useMemo(() => Array.from(new Set(insights.map(i => i.insight_type))), [insights]);

  const filteredInsights = useMemo(() => {
    let list = insightFilter ? insights.filter(i => i.insight_type === insightFilter) : insights;
    if (insightSearch.trim()) {
      const q = insightSearch.toLowerCase();
      list = list.filter(i =>
        i.content.toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [insights, insightFilter, insightSearch]);

  const filteredSources      = useMemo(() => sourceTypeFilter ? sources.filter(s => (s.source_type || 'book') === sourceTypeFilter) : sources, [sources, sourceTypeFilter]);
  const presentSourceTypes   = useMemo(() => Array.from(new Set(sources.map(s => s.source_type || 'book'))), [sources]);
  const runningExperiments   = useMemo(() => experiments.filter(e => e.status === 'running'), [experiments]);
  const recentInsights       = useMemo(() => insights.slice(0, 5), [insights]);

  // ── Stats ────────────────────────────────────────────────────────────
  const stats = [
    { value: insights.length,              label: 'Insights saved',      color: '#f5a623', icon: Lightbulb,    tab: 'insights'    },
    { value: runningExperiments.length,    label: 'Experiments running', color: '#2d9b6f', icon: FlaskConical, tab: 'experiments' },
    { value: concepts.nodes?.length || 0, label: 'Concept nodes',       color: '#7b5ea7', icon: Share2,       tab: 'graph'       },
    { value: sources.length,              label: 'Sources in library',   color: '#4a6fa5', icon: LibraryIcon,  tab: 'library'     },
  ];

  return (
    <div className="ds-page pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8 w-full page-enter">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <BrainCircuit size={22} className="text-[#7b5ea7]" />
          <h1 className="text-[22px] font-bold text-[#1c1c1c]">Learning Memory</h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 mb-8 border-b border-[#eceae4] overflow-x-auto">
          {TABS.map(tab => {
            const Icon   = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium
                           border-b-2 transition-colors whitespace-nowrap cursor-pointer
                           bg-transparent"
                style={{
                  color:       active ? '#f5a623' : '#5f5f5d',
                  borderColor: active ? '#f5a623' : 'transparent',
                }}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="ds-spinner" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ── Overview ──────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {stats.map((s, i) => (
                    <StatCard
                      key={s.tab}
                      value={s.value}
                      label={s.label}
                      color={s.color}
                      icon={s.icon}
                      index={i}
                      onClick={() => setActiveTab(s.tab)}
                    />
                  ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05, ease: EASE_OUT }}
                    onClick={() => navigate('/learn')}
                    whileTap={{ scale: 0.97 }}
                    className="ds-card flex items-center gap-3 text-left w-full cursor-pointer
                               hover:border-[#d6d2c7] transition-colors duration-150"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#fef3dc] flex items-center justify-center flex-shrink-0">
                      <BrainCircuit size={16} className="text-[#f5a623]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1c1c1c]">New learning session</p>
                      <p className="text-[11px] text-[#8f8a80]">Ask your knowledge canon a question</p>
                    </div>
                    <ArrowRight size={14} className="text-[#8f8a80] ml-auto flex-shrink-0" />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.10, ease: EASE_OUT }}
                    onClick={() => navigate('/lab')}
                    whileTap={{ scale: 0.97 }}
                    className="ds-card flex items-center gap-3 text-left w-full cursor-pointer
                               hover:border-[#d6d2c7] transition-colors duration-150"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#2d9b6f18] flex items-center justify-center flex-shrink-0">
                      <FlaskConical size={16} style={{ color: '#2d9b6f' }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1c1c1c]">Experience Lab</p>
                      <p className="text-[11px] text-[#8f8a80]">Design and run experiments</p>
                    </div>
                    <ArrowRight size={14} className="text-[#8f8a80] ml-auto flex-shrink-0" />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.15, ease: EASE_OUT }}
                    onClick={() => navigate('/builder')}
                    whileTap={{ scale: 0.97 }}
                    className="ds-card flex items-center gap-3 text-left w-full cursor-pointer
                               hover:border-[#d6d2c7] transition-colors duration-150"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#4a6fa518] flex items-center justify-center flex-shrink-0">
                      <Clapperboard size={16} style={{ color: '#4a6fa5' }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1c1c1c]">Builder Studio</p>
                      <p className="text-[11px] text-[#8f8a80]">Simulate principles in action</p>
                    </div>
                    <ArrowRight size={14} className="text-[#8f8a80] ml-auto flex-shrink-0" />
                  </motion.button>
                </div>

                {/* Recent insights */}
                {recentInsights.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="ds-label">Recent insights</h2>
                      <button
                        onClick={() => setActiveTab('insights')}
                        className="text-[12px] text-[#f5a623] font-semibold bg-transparent
                                   border-none cursor-pointer hover:opacity-80"
                      >
                        See all →
                      </button>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {recentInsights.map((ins, i) => (
                        <InsightCard
                          key={ins.id}
                          insight={ins}
                          index={i}
                          onTagClick={t => { setInsightSearch(t); setActiveTab('insights'); }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Running experiments */}
                {runningExperiments.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="ds-label">Running experiments</h2>
                      <button
                        onClick={() => setActiveTab('experiments')}
                        className="text-[12px] text-[#f5a623] font-semibold bg-transparent
                                   border-none cursor-pointer hover:opacity-80"
                      >
                        See all →
                      </button>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {runningExperiments.map((e, i) => (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22, delay: i * 0.05, ease: EASE_OUT }}
                          className="ds-card border-l-[3px]"
                          style={{ borderLeftColor: '#f5a623' }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[14px] font-semibold text-[#1c1c1c]">{e.title}</p>
                            <span className="text-[10px] font-bold uppercase text-[#f5a623]">Running</span>
                          </div>
                          {e.hypothesis && (
                            <p className="text-[12px] text-[#5f5f5d] leading-relaxed mb-2">{e.hypothesis}</p>
                          )}
                          <motion.button
                            onClick={() => navigate(`/lab/${e.id}/review`)}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.1 }}
                            className="ds-btn ds-btn-dark text-[12px] py-1.5 px-3"
                          >
                            Review experiment →
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {insights.length === 0 && experiments.length === 0 && (
                  <EmptyState
                    icon={BrainCircuit}
                    title="Your memory is empty"
                    body="Complete a learning session, run an experiment, or simulate a principle — everything feeds back here."
                    cta="Start a session →"
                    onCta={() => navigate('/learn')}
                  />
                )}
              </motion.div>
            )}

            {/* ── Insights ──────────────────────────────────────────── */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {/* Search */}
                <div className="relative mb-4">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8a80]" />
                  <input
                    value={insightSearch}
                    onChange={e => setInsightSearch(e.target.value)}
                    placeholder="Search insights by keyword or tag…"
                    className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-xl pl-9 pr-9 py-2.5
                               text-[14px] text-[#1c1c1c] placeholder:text-[#8f8a80]
                               focus:outline-none focus:border-[#d6d2c7] transition-colors duration-150"
                  />
                  {insightSearch && (
                    <button onClick={() => setInsightSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8a80]
                                 hover:text-[#5f5f5d] bg-transparent border-none cursor-pointer p-0">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Type filter chips */}
                {insightTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setInsightFilter(null)}
                      className="text-[12px] px-3 py-1.5 rounded-full border cursor-pointer
                                 transition-colors duration-150 bg-transparent"
                      style={!insightFilter
                        ? { borderColor: '#f5a623', color: '#f5a623', background: '#f5a62308' }
                        : { borderColor: '#eceae4', color: '#5f5f5d' }}
                    >
                      All ({insights.length})
                    </button>
                    {insightTypes.map(type => {
                      const color  = INSIGHT_COLORS[type] || '#5f5f5d';
                      const active = insightFilter === type;
                      const count  = insights.filter(i => i.insight_type === type).length;
                      return (
                        <button
                          key={type}
                          onClick={() => setInsightFilter(active ? null : type)}
                          className="text-[12px] px-3 py-1.5 rounded-full border cursor-pointer
                                     capitalize transition-colors duration-150 bg-transparent"
                          style={active
                            ? { borderColor: color, color, background: `${color}10` }
                            : { borderColor: '#eceae4', color: '#5f5f5d' }}
                        >
                          {type.replace(/_/g, ' ')} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredInsights.length === 0 ? (
                  <EmptyState
                    icon={Lightbulb}
                    title={insightSearch ? `No results for "${insightSearch}"` : 'No insights yet'}
                    body={insightSearch ? 'Try a different keyword or clear the filter.' : 'Save one from any Learn session to start building your memory.'}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredInsights.map((ins, i) => (
                      <InsightCard
                        key={ins.id}
                        insight={ins}
                        index={i}
                        onTagClick={t => setInsightSearch(t)}
                      />
                    ))}
                    {insightSearch && (
                      <p className="text-[11px] text-[#8f8a80] text-center py-2">
                        {filteredInsights.length} result{filteredInsights.length !== 1 ? 's' : ''} for "{insightSearch}"
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Experiments ───────────────────────────────────────── */}
            {activeTab === 'experiments' && (
              <motion.div
                key="experiments"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {experiments.length === 0 ? (
                  <EmptyState
                    icon={FlaskConical}
                    title="No experiments yet"
                    body="Design one in the Experience Lab — simulations auto-generate experiment ideas too."
                    cta="Go to Lab →"
                    onCta={() => navigate('/lab')}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {experiments.map((e, i) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: i * 0.04, ease: EASE_OUT }}
                        className="ds-card"
                        style={{ borderLeft: `4px solid ${STATUS_COLORS[e.status] || '#eceae4'}` }}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="text-[14px] font-semibold text-[#1c1c1c] pr-2">{e.title}</h4>
                          <span
                            className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              color:      STATUS_COLORS[e.status],
                              background: `${STATUS_COLORS[e.status]}18`,
                            }}
                          >
                            {e.status}
                          </span>
                        </div>
                        {e.hypothesis && (
                          <p className="text-[12px] text-[#5f5f5d] leading-relaxed mb-2">{e.hypothesis}</p>
                        )}
                        {e.status === 'running' && (
                          <motion.button
                            onClick={() => navigate(`/lab/${e.id}/review`)}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.1 }}
                            className="ds-btn ds-btn-dark text-[12px] py-1.5 px-3"
                          >
                            Review experiment →
                          </motion.button>
                        )}
                        {e.lessons_learned && (
                          <p className="text-[12px] text-[#5f5f5d] italic mt-2 leading-relaxed">
                            "{e.lessons_learned}"
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Knowledge Graph ───────────────────────────────────── */}
            {activeTab === 'graph' && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[16px] font-bold text-[#1c1c1c]">Your Knowledge Graph</h2>
                    <p className="text-[12px] text-[#8f8a80] mt-0.5">
                      {concepts.nodes?.length || 0} concepts · {concepts.edges?.length || 0} connections
                    </p>
                  </div>
                  <motion.button
                    onClick={() => navigate('/map')}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.1 }}
                    className="ds-btn ds-btn-ghost text-[12px]"
                  >
                    Full screen →
                  </motion.button>
                </div>

                <div className="bg-[#fbf9f3] border border-[#eceae4] rounded-2xl overflow-hidden">
                  <ConceptGraph />
                </div>

                <div className="flex gap-4 mt-3 justify-center">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8f8a80]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623] inline-block" /> Concept node
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8f8a80]">
                    <span className="w-4 h-px bg-[#b8b3a8] inline-block" /> Connection
                  </div>
                </div>

                {/* Concept list below graph */}
                {concepts.nodes?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="ds-label mb-3">All concepts</h3>
                    <div className="flex flex-wrap gap-2">
                      {[...concepts.nodes]
                        .sort((a, b) => (b.session_count || 0) - (a.session_count || 0))
                        .map((node, i) => (
                          <motion.span
                            key={node.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15, delay: i * 0.02 }}
                            className="text-[12px] px-2.5 py-1 rounded-full border border-[#eceae4]
                                       text-[#5f5f5d] bg-[#fbf9f3] cursor-default"
                            title={node.description || node.label}
                          >
                            {node.label}
                            {node.session_count > 1 && (
                              <span className="ml-1 text-[10px] text-[#f5a623] font-semibold">
                                ×{node.session_count}
                              </span>
                            )}
                          </motion.span>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Library ───────────────────────────────────────────── */}
            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {presentSourceTypes.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setSourceTypeFilter(null)}
                      className="text-[12px] px-3 py-1.5 rounded-full border cursor-pointer
                                 transition-colors duration-150 bg-transparent"
                      style={!sourceTypeFilter
                        ? { borderColor: '#f5a623', color: '#f5a623', background: '#f5a62308' }
                        : { borderColor: '#eceae4', color: '#5f5f5d' }}
                    >
                      All ({sources.length})
                    </button>
                    {presentSourceTypes.map(type => {
                      const color  = SOURCE_TYPE_COLORS[type] || '#5f5f5d';
                      const active = sourceTypeFilter === type;
                      const count  = sources.filter(s => (s.source_type || 'book') === type).length;
                      return (
                        <button
                          key={type}
                          onClick={() => setSourceTypeFilter(active ? null : type)}
                          className="text-[12px] px-3 py-1.5 rounded-full border cursor-pointer
                                     capitalize transition-colors duration-150 bg-transparent"
                          style={active
                            ? { borderColor: color, color, background: `${color}10` }
                            : { borderColor: '#eceae4', color: '#5f5f5d' }}
                        >
                          {type} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredSources.length === 0 ? (
                  <EmptyState
                    icon={LibraryIcon}
                    title="Knowledge base is empty"
                    body="Add a book, article, URL, or note from the Library."
                    cta="Go to Library →"
                    onCta={() => navigate('/library')}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredSources.map((s, i) => {
                      const color = SOURCE_TYPE_COLORS[s.source_type] || '#5f5f5d';
                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.03, ease: EASE_OUT }}
                          onClick={() => navigate(`/source/${s.id}`)}
                          className="ds-card flex items-center justify-between cursor-pointer
                                     hover:border-[#d6d2c7] transition-colors duration-150"
                        >
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-[#1c1c1c] truncate">{s.title}</p>
                            <p className="text-[12px] text-[#5f5f5d] truncate">{s.author || 'Unknown'}</p>
                          </div>
                          <span
                            className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-3"
                            style={{ color, background: `${color}15` }}
                          >
                            {s.source_type || 'book'}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body, cta, onCta }) {
  return (
    <div className="flex flex-col items-center text-center py-16 gap-3 max-w-sm mx-auto">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#fef3dc] flex items-center justify-center">
          <Icon size={20} className="text-[#f5a623]" />
        </div>
      )}
      <p className="text-[15px] font-semibold text-[#1c1c1c]">{title}</p>
      {body && <p className="text-[13px] text-[#5f5f5d] leading-relaxed">{body}</p>}
      {cta && onCta && (
        <motion.button
          onClick={onCta}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          className="mt-1 ds-btn ds-btn-amber"
        >
          {cta}
        </motion.button>
      )}
    </div>
  );
}
