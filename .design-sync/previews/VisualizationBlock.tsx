// VisualizationBlock uses motion.div with initial={{ opacity: 0, scale: 0.95 }} — blank in headless capture.
// Static recreation with the same layout.

const VizPanel = ({ type, title, code }: any) => (
  <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a2a', background: '#0d0d0d' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span style={{ fontSize: '12px', color: '#9a8a78', fontWeight: 500 }}>{title || type}</span>
      </div>
      <button style={{ color: '#5a4a3a', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
    </div>
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: code }} />
  </div>
);

const habitLoopSvg = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#f5a623"/>
    </marker>
  </defs>
  <circle cx="200" cy="150" r="80" fill="none" stroke="#2a2a2a" stroke-width="2"/>
  <circle cx="200" cy="70" r="36" fill="#1a1a1a" stroke="#f5a623" stroke-width="1.5"/>
  <text x="200" y="65" text-anchor="middle" fill="#f5f0e8" font-size="11">Cue</text>
  <text x="200" y="80" text-anchor="middle" fill="#9a8a78" font-size="9">Morning alarm</text>
  <circle cx="310" cy="200" r="36" fill="#1a1a1a" stroke="#7b5ea7" stroke-width="1.5"/>
  <text x="310" y="195" text-anchor="middle" fill="#f5f0e8" font-size="11">Routine</text>
  <text x="310" y="210" text-anchor="middle" fill="#9a8a78" font-size="9">Exercise</text>
  <circle cx="90" cy="200" r="36" fill="#1a1a1a" stroke="#2d9b6f" stroke-width="1.5"/>
  <text x="90" y="195" text-anchor="middle" fill="#f5f0e8" font-size="11">Reward</text>
  <text x="90" y="210" text-anchor="middle" fill="#9a8a78" font-size="9">Coffee</text>
  <line x1="225" y1="100" x2="285" y2="165" stroke="#f5a623" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="275" y1="220" x2="130" y2="220" stroke="#7b5ea7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="110" y1="175" x2="180" y2="100" stroke="#2d9b6f" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>`;

const timelineSvg = `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="60" x2="460" y2="60" stroke="#2a2a2a" stroke-width="2"/>
  ${[['Day 1', 40, 'Start tiny'], ['Week 1', 140, 'Build cue'], ['Week 4', 260, 'Automate'], ['3 Months', 380, 'Identity shift']].map(([label, x, sub]) => `
    <circle cx="${x}" cy="60" r="8" fill="#f5a623"/>
    <text x="${x}" y="40" text-anchor="middle" fill="#f5f0e8" font-size="11">${label}</text>
    <text x="${x}" y="90" text-anchor="middle" fill="#9a8a78" font-size="10">${sub}</text>
  `).join('')}
</svg>`;

export const HabitLoop = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '520px' }}>
    <VizPanel type="diagram" title="The Habit Loop" code={habitLoopSvg} />
  </div>
);

export const Timeline = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '520px' }}>
    <VizPanel type="timeline" title="Habit Formation Timeline" code={timelineSvg} />
  </div>
);
