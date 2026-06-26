import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function GenericHomeReflection({ mood = 'night', figurePose = 'seated', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="gh-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="gh-sky" />

        {/* Window with city/sky view, background */}
        <rect x="500" y="40" width="220" height="260" rx="6" fill={PALETTE.navy} opacity="0.3" />
        <rect x="500" y="40" width="220" height="260" rx="6" fill="none" stroke={PALETTE.charcoal} strokeWidth="6" opacity="0.5" />
        <line x1="610" y1="40" x2="610" y2="300" stroke={PALETTE.charcoal} strokeWidth="4" opacity="0.5" />
        <circle cx="660" cy="110" r="16" fill={glow} opacity="0.6" className="gh-moon" />

        {/* Bookshelf silhouette, midground */}
        <g opacity="0.6">
          <rect x="60" y="100" width="160" height="200" fill="#2a1f17" />
          {Array.from({ length: 4 }).map((_, row) => (
            Array.from({ length: 6 }).map((_, col) => (
              <rect key={`${row}-${col}`} x={68 + col * 24} y={108 + row * 46} width="18" height="40" fill={PALETTE.terracotta} opacity={0.3 + ((row + col) % 3) * 0.15} />
            ))
          ))}
        </g>

        {/* Lamp glow */}
        <g transform="translate(330,260)">
          <rect x="-3" y="0" width="6" height="60" fill="#2a2a2a" />
          <polygon points="-26,-30 26,-30 18,0 -18,0" fill={glow} opacity="0.5" className="gh-lamp" />
        </g>

        {/* Floor + armchair */}
        <rect y="340" width="800" height="110" fill={PALETTE.charcoal} opacity="0.25" />
        <rect x="350" y="350" width="120" height="60" rx="14" fill="#3a2a1f" opacity="0.7" />

        {/* Open book on lap */}
        <path d="M380,360 L410,366 L440,360 L440,370 L410,376 L380,370 Z" fill={PALETTE.cream} opacity="0.8" />

        <FigureSilhouette pose={figurePose} x={410} y={372} scale={0.95} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .gh-scene { width: 100%; height: 100%; }
        .gh-moon { animation: gh-glow 6s ease-in-out infinite; }
        .gh-lamp { animation: gh-warm 4s ease-in-out infinite; }
        @keyframes gh-glow { 0%,100% { opacity: 0.5; } 50% { opacity: 0.75; } }
        @keyframes gh-warm { 0%,100% { opacity: 0.45; } 50% { opacity: 0.65; } }
      `}</style>
    </div>
  );
}
