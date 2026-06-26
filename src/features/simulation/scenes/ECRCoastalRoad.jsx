import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function ECRCoastalRoad({ mood = 'goldenHour', figurePose = 'none', accentColor }) {
  const sky = getMoodSky(mood);
  const sun = accentColor || sky.sun;

  return (
    <div className="ec-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="ec-sky" />

        <circle cx="600" cy="140" r="40" fill={sun} opacity="0.85" className="ec-sun" />

        {/* Sea to the right, road curving along it */}
        <rect x="500" y="170" width="300" height="120" fill={PALETTE.navy} opacity="0.6" />
        <path d="M500,200 Q650,190 800,200" stroke={PALETTE.cream} strokeWidth="2" opacity="0.3" fill="none" />

        {/* Palm row, midground */}
        <g className="ec-palms">
          {[80, 180, 260, 340].map((x, i) => (
            <g key={i} transform={`translate(${x},${250 - (i % 2) * 10})`}>
              <rect x="-4" y="0" width="8" height="60" fill="#3a2a1f" opacity="0.8" />
              <g className="ec-frond" style={{ animationDelay: `${i * 0.5}s` }}>
                <path d="M0,0 Q-30,-10 -45,5" stroke={PALETTE.forest} strokeWidth="6" fill="none" />
                <path d="M0,0 Q30,-10 45,5" stroke={PALETTE.forest} strokeWidth="6" fill="none" />
                <path d="M0,0 Q-20,-25 -10,-38" stroke={PALETTE.forest} strokeWidth="6" fill="none" />
                <path d="M0,0 Q20,-25 10,-38" stroke={PALETTE.forest} strokeWidth="6" fill="none" />
              </g>
            </g>
          ))}
        </g>

        {/* Road foreground curving away */}
        <path d="M0,450 Q300,330 800,360 L800,450 Z" fill="#2a2a2a" opacity="0.85" />
        <path d="M40,440 Q320,340 780,365" stroke={PALETTE.cream} strokeWidth="3" strokeDasharray="14 10" opacity="0.4" fill="none" className="ec-dashes" />

        {/* Roadside food stall */}
        <g transform="translate(120,330)" opacity="0.8">
          <rect x="-20" y="0" width="40" height="26" fill={PALETTE.terracotta} />
          <polygon points="-26,0 26,0 0,-16" fill={PALETTE.charcoal} />
        </g>

        <FigureSilhouette pose={figurePose} x={400} y={400} scale={1.1} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .ec-scene { width: 100%; height: 100%; }
        .ec-sun { animation: ec-glow 6s ease-in-out infinite; }
        .ec-frond { animation: ec-sway 5s ease-in-out infinite; transform-origin: bottom center; }
        .ec-dashes { animation: ec-flow 2s linear infinite; }
        @keyframes ec-glow { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }
        @keyframes ec-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes ec-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -48; } }
      `}</style>
    </div>
  );
}
