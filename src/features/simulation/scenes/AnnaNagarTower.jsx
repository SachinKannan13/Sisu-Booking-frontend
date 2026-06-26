import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function AnnaNagarTowerScene({ mood = 'evening', figurePose = 'standing', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="an-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="an-sky" />

        {/* Park canopy background */}
        <ellipse cx="200" cy="160" rx="160" ry="70" fill={PALETTE.forest} opacity="0.3" />
        <ellipse cx="600" cy="150" rx="180" ry="75" fill={PALETTE.forest} opacity="0.3" />

        {/* The tower — distinctive layered cylinder */}
        <g transform="translate(400,60)">
          <rect x="-18" y="0" width="36" height="220" fill={PALETTE.navy} opacity="0.7" />
          <ellipse cx="0" cy="0" rx="34" ry="10" fill={PALETTE.navy} opacity="0.8" />
          <ellipse cx="0" cy="220" rx="44" ry="12" fill={PALETTE.navy} opacity="0.6" />
          {Array.from({ length: 5 }).map((_, i) => (
            <circle key={i} cx="0" cy={20 + i * 40} r="5" fill={glow} className="an-light" opacity="0.7" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>

        {/* Boating lake foreground-mid */}
        <ellipse cx="400" cy="330" rx="320" ry="50" fill={PALETTE.navy} opacity="0.5" className="an-lake" />

        {/* Musical fountain jets */}
        <g className="an-fountain" opacity="0.6">
          <path d="M380,330 q-10,-30 0,-50" stroke={PALETTE.cream} strokeWidth="3" fill="none" />
          <path d="M400,330 q0,-40 0,-60" stroke={PALETTE.cream} strokeWidth="3" fill="none" />
          <path d="M420,330 q10,-30 0,-50" stroke={PALETTE.cream} strokeWidth="3" fill="none" />
        </g>

        {/* Park ground */}
        <rect y="360" width="800" height="90" fill={PALETTE.cream} opacity="0.8" />

        <FigureSilhouette pose={figurePose} x={250} y={390} scale={1.15} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .an-scene { width: 100%; height: 100%; }
        .an-light { animation: an-pulse 4s ease-in-out infinite; }
        .an-lake { animation: an-ripple 7s ease-in-out infinite; }
        .an-fountain path { animation: an-spray 2.4s ease-in-out infinite; transform-origin: bottom; }
        @keyframes an-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        @keyframes an-ripple { 0%,100% { opacity: 0.45; } 50% { opacity: 0.6; } }
        @keyframes an-spray { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.15); } }
      `}</style>
    </div>
  );
}
