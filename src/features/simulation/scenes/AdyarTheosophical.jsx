import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function AdyarTheosophical({ mood = 'midday', figurePose = 'seated', accentColor }) {
  const leaf = accentColor || PALETTE.forest;

  return (
    <div className="ad-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="ad-sky" />

        {/* Background canopy haze */}
        <rect y="0" width="800" height="280" fill={leaf} opacity="0.12" />

        {/* The Great Banyan — sprawling canopy, layered */}
        <g className="ad-canopy">
          <ellipse cx="400" cy="160" rx="340" ry="120" fill={leaf} opacity="0.35" />
          <ellipse cx="280" cy="140" rx="180" ry="90" fill={leaf} opacity="0.45" />
          <ellipse cx="520" cy="150" rx="200" ry="95" fill={leaf} opacity="0.4" />
        </g>

        {/* Trunk + aerial roots */}
        <g opacity="0.8">
          <rect x="380" y="180" width="40" height="160" fill="#3a2a1f" />
          <path d="M380,220 Q350,260 360,330" stroke="#3a2a1f" strokeWidth="8" fill="none" />
          <path d="M420,220 Q450,260 442,330" stroke="#3a2a1f" strokeWidth="8" fill="none" />
          <path d="M395,200 Q390,260 398,335" stroke="#3a2a1f" strokeWidth="6" fill="none" />
        </g>

        {/* Dappled light spots */}
        <g className="ad-dapple" opacity="0.3">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={120 + i * 65} cy={200 + (i % 3) * 30} r="10" fill={PALETTE.gold} />
          ))}
        </g>

        {/* Library building, background right */}
        <rect x="600" y="220" width="140" height="100" fill={PALETTE.cream} opacity="0.4" />
        <polygon points="600,220 740,220 670,190" fill={PALETTE.terracotta} opacity="0.5" />

        {/* Ground */}
        <rect y="340" width="800" height="110" fill={PALETTE.cream} opacity="0.8" />
        <rect x="340" y="350" width="120" height="8" fill="#5c4a3a" opacity="0.5" />

        <FigureSilhouette pose={figurePose} x={400} y={380} scale={1.1} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .ad-scene { width: 100%; height: 100%; }
        .ad-canopy { animation: ad-sway 9s ease-in-out infinite; transform-origin: 400px 160px; }
        .ad-dapple circle { animation: ad-flicker 4s ease-in-out infinite; }
        @keyframes ad-sway { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(0.6deg); } }
        @keyframes ad-flicker { 0%,100% { opacity: 0.2; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
