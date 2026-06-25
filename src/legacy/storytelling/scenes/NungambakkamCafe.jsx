import { SceneRoot, SkyBackground, FigureSilhouette, ParticleLayer, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function NungambakkamCafe({ mood = 'goldenHour', figurePose = 'seated', accentColor }) {
  const sky = getMoodSky(mood);
  const lightColor = accentColor || PALETTE.gold;

  return (
    <div className="nc-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="nc-sky" />

        {/* Background: courtyard wall + tree canopy */}
        <rect y="80" width="800" height="370" fill={PALETTE.charcoal} opacity="0.25" />
        <circle cx="120" cy="120" r="90" fill={PALETTE.forest} opacity="0.4" />
        <circle cx="680" cy="110" r="100" fill={PALETTE.forest} opacity="0.35" />

        {/* Café building facade (midground) */}
        <rect x="180" y="140" width="440" height="220" rx="6" fill="#3a2a1f" opacity="0.85" />
        <rect x="200" y="160" width="400" height="120" rx="4" fill="#5c3a1a" opacity="0.6" />
        {/* Windows with warm glow */}
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={230 + i * 95} y={180} width="55" height="70" rx="3" fill={lightColor} opacity={mood === 'night' ? 0.8 : 0.4} className="nc-window" />
        ))}

        {/* Awning */}
        <polygon points="170,150 630,150 610,180 190,180" fill={PALETTE.terracotta} opacity="0.8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <polygon key={i} points={`${190 + i * 55},180 ${190 + i * 55 + 28},180 ${190 + i * 55 + 14},195`} fill={PALETTE.cream} opacity="0.5" />
        ))}

        {/* String lights across courtyard */}
        <path d="M150,200 Q400,160 650,200" stroke="#2a2a2a" strokeWidth="2" fill="none" opacity="0.5" />
        <g className="nc-lights">
          {Array.from({ length: 9 }).map((_, i) => {
            const t = i / 8;
            const x = 150 + t * 500;
            const y = 200 - Math.sin(t * Math.PI) * 40;
            return <circle key={i} cx={x} cy={y + 6} r="4" fill={lightColor} className="nc-bulb" style={{ animationDelay: `${i * 0.3}s` }} />;
          })}
        </g>

        {/* Courtyard floor + table */}
        <rect y="330" width="800" height="120" fill={PALETTE.cream} opacity="0.85" />
        <ellipse cx="400" cy="370" rx="70" ry="18" fill="#2a2a2a" opacity="0.15" />
        <rect x="370" y="350" width="60" height="6" rx="3" fill="#3a2a1f" />
        <rect x="395" y="356" width="10" height="30" fill="#3a2a1f" />

        {/* Steam from a cup beside the figure */}
        <g className="nc-steam" opacity="0.5">
          <path d="M340,345 q4,-10 0,-18 q-4,-8 0,-16" stroke={PALETTE.cream} strokeWidth="2" fill="none" />
        </g>
        <ellipse cx="340" cy="350" rx="8" ry="4" fill="#3a2a1f" />

        <FigureSilhouette pose={figurePose} x={430} y={372} scale={1.1} color="#1a1410" />

        {/* Warm dust motes drifting in the café's afternoon light */}
        <ParticleLayer variant="dust" count={12} color={PALETTE.gold} opacity={0.35} area={{ x: 150, y: 150, w: 500, h: 180 }} />
      </SceneRoot>

      <style>{`
        .nc-scene { width: 100%; height: 100%; }
        .nc-window { animation: nc-glow 5s ease-in-out infinite; }
        .nc-bulb { animation: nc-twinkle 2.4s ease-in-out infinite; }
        .nc-steam { animation: nc-rise 4s ease-in-out infinite; }
        .pl-particle { animation: pl-drift-float 5.5s ease-in-out infinite; }
        @keyframes nc-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.65; } }
        @keyframes nc-twinkle { 0%,100% { opacity: 0.5; r: 4px; } 50% { opacity: 1; r: 5px; } }
        @keyframes nc-rise { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-16px); } }
        @keyframes pl-drift-float { 0%,100% { transform: translate(0,0); opacity: 0.3; } 50% { transform: translate(-5px,-10px); opacity: 0.55; } }
      `}</style>
    </div>
  );
}
