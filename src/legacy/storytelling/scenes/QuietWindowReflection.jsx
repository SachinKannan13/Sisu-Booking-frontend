import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

// Distinct from GenericHomeReflection (a furnished room with a bookshelf) —
// this is a sparer, more solitary beat: one window, one light source,
// stars or rain outside, almost nothing else in the frame. Used for
// generic_reflection, when a slide needs quiet introspection rather than
// a specific room with personal objects.
export default function QuietWindowReflection({ mood = 'night', figurePose = 'seated', accentColor }) {
  const sky = getMoodSky(mood);
  const light = accentColor || PALETTE.cream;
  const isRain = mood === 'rain';

  return (
    <div className="qw-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="qw-sky" />

        {/* Single large window, dead-center, dominating the frame */}
        <rect x="290" y="40" width="220" height="280" rx="4" fill={PALETTE.navy} opacity="0.35" />
        <rect x="290" y="40" width="220" height="280" rx="4" fill="none" stroke={PALETTE.charcoal} strokeWidth="8" opacity="0.6" />
        <line x1="400" y1="40" x2="400" y2="320" stroke={PALETTE.charcoal} strokeWidth="5" opacity="0.6" />
        <line x1="290" y1="180" x2="510" y2="180" stroke={PALETTE.charcoal} strokeWidth="5" opacity="0.6" />

        {!isRain && (
          <g className="qw-stars" opacity="0.7">
            {Array.from({ length: 14 }).map((_, i) => (
              <circle
                key={i}
                cx={310 + (i * 13) % 180}
                cy={55 + (i * 37) % 110}
                r={i % 4 === 0 ? 2.4 : 1.3}
                fill={light}
                className="qw-star"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </g>
        )}

        {isRain && (
          <g className="qw-rain" opacity="0.5" stroke={light} strokeWidth="2">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={i} x1={300 + i * 13} y1={50 + (i % 3) * 10} x2={292 + i * 13} y2={90 + (i % 3) * 10} className="qw-drop" style={{ animationDelay: `${(i % 6) * 0.2}s` }} />
            ))}
          </g>
        )}

        {/* Single lamp — the only warm light source in an otherwise dim room */}
        <g transform="translate(620,260)">
          <rect x="-3" y="0" width="6" height="80" fill="#2a2a2a" opacity="0.7" />
          <ellipse cx="0" cy="-10" rx="30" ry="14" fill={light} opacity="0.35" className="qw-glow" />
          <polygon points="-20,-22 20,-22 14,4 -14,4" fill={light} opacity="0.6" />
        </g>

        {/* Floor, minimal */}
        <rect y="340" width="800" height="110" fill={PALETTE.charcoal} opacity="0.2" />

        {/* A single chair, nothing else in the room */}
        <rect x="170" y="330" width="90" height="50" rx="10" fill="#2a221c" opacity="0.7" />

        <FigureSilhouette pose={figurePose} x={215} y={352} scale={0.9} color="#0d0d0d" />
      </SceneRoot>
      <style>{`
        .qw-scene { width: 100%; height: 100%; }
        .qw-star { animation: qw-twinkle 3.5s ease-in-out infinite; }
        .qw-drop { animation: qw-fall 1.1s linear infinite; }
        .qw-glow { animation: qw-pulse 5s ease-in-out infinite; }
        @keyframes qw-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 0.9; } }
        @keyframes qw-fall { 0% { transform: translateY(-10px); opacity: 0; } 30% { opacity: 0.6; } 100% { transform: translateY(20px); opacity: 0; } }
        @keyframes qw-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
