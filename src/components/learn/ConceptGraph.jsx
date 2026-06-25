import { useState, useEffect, useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { getConcepts } from '../../lib/api.js';

const WIDTH = 720;
const HEIGHT = 440;

/**
 * Cheap force-directed layout (repulsion + edge attraction + centering),
 * run for a fixed number of iterations on the client. No graph library —
 * personal concept graphs stay small (tens of nodes), so plain O(n^2)
 * physics for a few hundred iterations is instant and avoids a new
 * dependency just for this one view.
 */
function layout(nodes, edges) {
  const pos = new Map();
  nodes.forEach((n, i) => {
    const angle = (i / Math.max(nodes.length, 1)) * 2 * Math.PI;
    pos.set(n.id, {
      x: WIDTH / 2 + Math.cos(angle) * Math.min(WIDTH, HEIGHT) * 0.32,
      y: HEIGHT / 2 + Math.sin(angle) * Math.min(WIDTH, HEIGHT) * 0.32,
      vx: 0,
      vy: 0
    });
  });

  const k = Math.sqrt((WIDTH * HEIGHT) / Math.max(nodes.length, 1));

  for (let iter = 0; iter < 250; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = pos.get(nodes[i].id);
        const b = pos.get(nodes[j].id);
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (k * k) / dist / 9;
        dx /= dist;
        dy /= dist;
        a.vx += dx * force; a.vy += dy * force;
        b.vx -= dx * force; b.vy -= dy * force;
      }
    }
    edges.forEach(e => {
      const a = pos.get(e.from_id);
      const b = pos.get(e.to_id);
      if (!a || !b) return;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist * dist) / k / 14;
      dx /= dist;
      dy /= dist;
      a.vx += dx * force; a.vy += dy * force;
      b.vx -= dx * force; b.vy -= dy * force;
    });
    pos.forEach(p => {
      p.x += p.vx * 0.1;
      p.y += p.vy * 0.1;
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += (WIDTH / 2 - p.x) * 0.0025;
      p.y += (HEIGHT / 2 - p.y) * 0.0025;
      p.x = Math.max(36, Math.min(WIDTH - 36, p.x));
      p.y = Math.max(36, Math.min(HEIGHT - 36, p.y));
    });
  }
  return pos;
}

export default function ConceptGraph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getConcepts()
      .then(({ data }) => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const positions = useMemo(() => layout(nodes, edges), [nodes, edges]);

  const connectedIds = useMemo(() => {
    if (!selected) return null;
    const set = new Set([selected]);
    edges.forEach(e => {
      if (e.from_id === selected) set.add(e.to_id);
      if (e.to_id === selected) set.add(e.from_id);
    });
    return set;
  }, [selected, edges]);

  const radiusFor = (n) => Math.min(26, 12 + (n.insight_ids?.length || 1) * 3);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="text-center text-[#8f8a80] text-sm py-16 max-w-md mx-auto">
        Concept mapping is still warming up — as you save insights across sessions, recurring ideas will start forming a connected map here.
      </div>
    );
  }

  const selectedNode = nodes.find(n => n.id === selected);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-xs text-[#8f8a80]">
        <Share2 size={13} />
        {nodes.length} concept{nodes.length !== 1 ? 's' : ''} · {edges.length} connection{edges.length !== 1 ? 's' : ''} — click a node to explore it
      </div>

      <div className="bg-[#fbf9f3] border border-[#eceae4] rounded-2xl overflow-hidden">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 460 }}>
          {edges.map((e, i) => {
            const a = positions.get(e.from_id);
            const b = positions.get(e.to_id);
            if (!a || !b) return null;
            const dim = connectedIds && !(connectedIds.has(e.from_id) && connectedIds.has(e.to_id));
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#1c1c1c"
                strokeOpacity={dim ? 0.04 : 0.18}
                strokeWidth={1.5}
              />
            );
          })}

          {nodes.map(n => {
            const p = positions.get(n.id);
            if (!p) return null;
            const r = radiusFor(n);
            const dim = connectedIds && !connectedIds.has(n.id);
            const isSelected = selected === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x},${p.y})`}
                onClick={() => setSelected(isSelected ? null : n.id)}
                className="cursor-pointer"
                opacity={dim ? 0.3 : 1}
              >
                <circle
                  r={r}
                  fill={isSelected ? '#f5a623' : '#f5a62326'}
                  stroke="#f5a623"
                  strokeWidth={isSelected ? 2 : 1.2}
                />
                <text
                  y={r + 13}
                  textAnchor="middle"
                  className="text-[10px] font-medium select-none"
                  fill={isSelected ? '#1c1c1c' : '#5f5f5d'}
                >
                  {n.label.length > 18 ? `${n.label.slice(0, 17)}…` : n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedNode && (
        <div className="mt-4 bg-[#fbf9f3] border border-[#eceae4] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[#1c1c1c] text-sm font-semibold">{selectedNode.label}</h4>
            <button onClick={() => setSelected(null)} className="text-[#8f8a80] hover:text-[#1c1c1c] text-xs">
              Clear
            </button>
          </div>
          {selectedNode.description && (
            <p className="text-[#5f5f5d] text-sm mt-1.5">{selectedNode.description}</p>
          )}
          <p className="text-[#8f8a80] text-xs mt-2">
            Appears in {selectedNode.insight_ids?.length || 0} insight{selectedNode.insight_ids?.length === 1 ? '' : 's'}
            {selectedNode.source_ids?.length > 0 ? ` across ${selectedNode.source_ids.length} source${selectedNode.source_ids.length === 1 ? '' : 's'}` : ''}.
          </p>
        </div>
      )}
    </div>
  );
}
