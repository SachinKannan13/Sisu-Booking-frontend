import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lightbulb, FlaskConical, Share2, Library as LibraryIcon, Search, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import ConceptGraph from '../components/learn/ConceptGraph.jsx';
import { Card, CardContent } from '@/components/ui/shadcn/card.jsx';
import { Button } from '@/components/ui/shadcn/button.jsx';
import { getInsights, getExperiments, getBooksSlim } from '../lib/api.js';
import { INSIGHT_COLORS, SOURCE_TYPE_COLORS } from '../constants/learningModes.js';
import toast from 'react-hot-toast';

// Module-level cache — survives tab switches, cleared on save
let _memCache = null;
let _memCacheTime = 0;
const MEM_CACHE_TTL = 20_000;

const TABS = [
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'concepts', label: 'Concepts', icon: Share2 },
  { id: 'map', label: 'Concept Map', icon: Share2 },
  { id: 'library', label: 'Library', icon: LibraryIcon }
];

const STATUS_COLORS = {
  designed: '#5f5f5d', running: '#f5a623', completed: '#2d9b6f', abandoned: '#c85250'
};

const SOURCE_TYPES = ['book', 'article', 'essay', 'paper', 'transcript', 'interview', 'note', 'url'];

export default function LearningMemory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('insights');
  const cached = _memCache || { insights: [], experiments: [], sources: [] };
  const [insights, setInsights] = useState(cached.insights);
  const [insightFilter, setInsightFilter] = useState(null);
  const [insightSearch, setInsightSearch] = useState('');
  const [experiments, setExperiments] = useState(cached.experiments);
  const [sources, setSources] = useState(cached.sources);
  const [sourceTypeFilter, setSourceTypeFilter] = useState(null);
  const [loading, setLoading] = useState(!_memCache);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(v => _memCache ? false : true);
    try {
      const [insightsRes, experimentsRes, sourcesRes] = await Promise.all([
        getInsights().catch(() => ({ data: { insights: [] } })),
        getExperiments().catch(() => ({ data: { experiments: [] } })),
        getBooksSlim().catch(() => ({ data: [] }))
      ]);
      const next = {
        insights: insightsRes.data.insights || [],
        experiments: experimentsRes.data.experiments || [],
        sources: sourcesRes.data || []
      };
      _memCache = next;
      _memCacheTime = Date.now();
      setInsights(next.insights);
      setExperiments(next.experiments);
      setSources(next.sources);
    } catch (_) {
      if (!silent) toast.error('Failed to load learning memory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (_memCache && Date.now() - _memCacheTime < MEM_CACHE_TTL) {
      setLoading(false);
      fetchAll(true); // background refresh
    } else {
      fetchAll(false);
    }
  }, [fetchAll]);

  const insightTypes = Array.from(new Set(insights.map(i => i.insight_type)));

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

  const filteredSources = useMemo(() => {
    if (!sourceTypeFilter) return sources;
    return sources.filter(s => (s.source_type || 'book') === sourceTypeFilter);
  }, [sources, sourceTypeFilter]);

  const presentSourceTypes = useMemo(() =>
    Array.from(new Set(sources.map(s => s.source_type || 'book'))),
    [sources]
  );

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit size={22} className="text-[#7b5ea7]" />
          <h1 className="text-2xl font-bold text-[#1c1c1c]">Learning Memory</h1>
        </div>

        <div className="flex gap-1 mb-8 border-b border-[#eceae4] overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#f5a623] border-[#f5a623]'
                  : 'text-[#5f5f5d] border-transparent hover:text-[#1c1c1c]'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'insights' && (
              <div>
                {/* Search bar */}
                <div className="relative mb-4">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8a80]" />
                  <input
                    value={insightSearch}
                    onChange={e => setInsightSearch(e.target.value)}
                    placeholder="Search insights by keyword or tag..."
                    className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-xl pl-9 pr-9 py-2.5 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50"
                  />
                  {insightSearch && (
                    <button onClick={() => setInsightSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8a80] hover:text-[#5f5f5d]">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Type filter chips */}
                {insightTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setInsightFilter(null)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        !insightFilter ? 'border-[#f5a623] text-[#f5a623] bg-[#f5a623]/5' : 'border-[#eceae4] text-[#5f5f5d] hover:border-[#b8b3a8]'
                      }`}
                    >
                      All ({insights.length})
                    </button>
                    {insightTypes.map(type => {
                      const color = INSIGHT_COLORS[type] || '#5f5f5d';
                      const active = insightFilter === type;
                      const count = insights.filter(i => i.insight_type === type).length;
                      return (
                        <button
                          key={type}
                          onClick={() => setInsightFilter(active ? null : type)}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors capitalize"
                          style={active ? { borderColor: color, color, backgroundColor: `${color}10` } : { borderColor: '#eceae4', color: '#5f5f5d' }}
                        >
                          {type.replace('_', ' ')} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Results */}
                {filteredInsights.length === 0 ? (
                  <EmptyState text={
                    insightSearch ? `No insights matching "${insightSearch}".` :
                    'No insights saved yet. Save one from any Learn session.'
                  } />
                ) : (
                  <div className="space-y-3">
                    {filteredInsights.map(i => {
                      const color = INSIGHT_COLORS[i.insight_type] || '#5f5f5d';
                      return (
                        <div key={i.id} className="bg-[#fbf9f3] border border-[#eceae4] rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-semibold capitalize" style={{ color }}>
                              {i.insight_type.replace('_', ' ')}
                            </span>
                            <span className="text-[#8f8a80] text-xs">{new Date(i.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[#1c1c1c] text-sm leading-relaxed">{i.content}</p>
                          {i.tags?.length > 0 && (
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {i.tags.map((t, j) => (
                                <button
                                  key={j}
                                  onClick={() => setInsightSearch(t)}
                                  className="text-[10px] text-[#8f8a80] border border-[#eceae4] rounded-full px-2 py-0.5 hover:border-[#f5a623]/40 hover:text-[#f5a623] transition-colors"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {insightSearch && (
                      <p className="text-[#8f8a80] text-xs text-center py-2">
                        {filteredInsights.length} result{filteredInsights.length !== 1 ? 's' : ''} for &ldquo;{insightSearch}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experiments' && (
              experiments.length === 0 ? (
                <EmptyState text="No experiments yet. Design one in the Lab." />
              ) : (
                <div className="space-y-3">
                  {experiments.map(e => (
                    <div key={e.id} className="bg-[#fbf9f3] border border-[#eceae4] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[#1c1c1c] text-sm font-semibold">{e.title}</h4>
                        <span
                          className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full capitalize"
                          style={{ color: STATUS_COLORS[e.status], backgroundColor: 'rgba(28,28,28,0.05)' }}
                        >
                          {e.status}
                        </span>
                      </div>
                      {e.hypothesis && <p className="text-[#5f5f5d] text-xs">{e.hypothesis}</p>}
                      {e.status === 'running' && (
                        <button
                          onClick={() => navigate(`/lab/${e.id}/review`)}
                          style={{ fontSize: '12px', fontWeight: 600, color: '#2d9b6f', background: '#2d9b6f10', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', marginTop: '4px' }}
                        >
                          Review experiment →
                        </button>
                      )}
                      {e.lessons_learned && (
                        <p className="text-[#5f5f5d] text-xs mt-2 italic">&ldquo;{e.lessons_learned}&rdquo;</p>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'concepts' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#1c1c1c]">Your Knowledge Graph</h2>
                    <p className="text-xs text-[#8f8a80] mt-0.5">Concepts linked across your learning sessions</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/map')} className="text-xs border-[#eceae4] text-[#5f5f5d] hover:text-[#1c1c1c]">
                    Full screen →
                  </Button>
                </div>
                <Card className="bg-[#fbf9f3] border-[#eceae4] overflow-hidden">
                  <CardContent className="p-0">
                    <ConceptGraph />
                  </CardContent>
                </Card>
                <div className="flex gap-4 mt-3 justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-[#8f8a80]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623] inline-block" /> Concept node
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8f8a80]">
                    <span className="w-4 h-px bg-[#b8b3a8] inline-block" /> Relationship
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-[#5f5f5d]">Visualize how your concepts connect across your entire canon.</p>
                <Button onClick={() => navigate('/map')} className="bg-[#f5a623] hover:bg-[#e09520] text-[#1c1c1c] font-semibold">
                  Open Knowledge Map →
                </Button>
                <Card className="w-full bg-[#fbf9f3] border-[#eceae4] overflow-hidden">
                  <CardContent className="p-0">
                    <ConceptGraph />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                {/* Source type filter */}
                {presentSourceTypes.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      onClick={() => setSourceTypeFilter(null)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        !sourceTypeFilter ? 'border-[#f5a623] text-[#f5a623] bg-[#f5a623]/5' : 'border-[#eceae4] text-[#5f5f5d] hover:border-[#b8b3a8]'
                      }`}
                    >
                      All ({sources.length})
                    </button>
                    {presentSourceTypes.map(type => {
                      const color = SOURCE_TYPE_COLORS[type] || '#5f5f5d';
                      const active = sourceTypeFilter === type;
                      const count = sources.filter(s => (s.source_type || 'book') === type).length;
                      return (
                        <button
                          key={type}
                          onClick={() => setSourceTypeFilter(active ? null : type)}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors capitalize"
                          style={active ? { borderColor: color, color, backgroundColor: `${color}10` } : { borderColor: '#eceae4', color: '#5f5f5d' }}
                        >
                          {type} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredSources.length === 0 ? (
                  <EmptyState text="Your knowledge base is empty. Add a book, article, URL, or note from the Library." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredSources.map(s => {
                      const color = SOURCE_TYPE_COLORS[s.source_type] || '#5f5f5d';
                      return (
                        <div key={s.id} className="bg-[#fbf9f3] border border-[#eceae4] rounded-xl p-4 flex items-center justify-between">
                          <div className="min-w-0">
                            <h4 className="text-[#1c1c1c] text-sm font-medium truncate">{s.title}</h4>
                            <p className="text-[#5f5f5d] text-xs truncate">{s.author || 'Unknown'}</p>
                          </div>
                          <span
                            className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                            style={{ color, backgroundColor: `${color}15` }}
                          >
                            {s.source_type || 'book'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center text-[#8f8a80] text-sm py-16 max-w-md mx-auto">
      {text}
    </div>
  );
}
