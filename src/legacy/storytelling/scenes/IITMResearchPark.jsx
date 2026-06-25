import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function IITMResearchPark({ mood = 'night', figurePose = 'armsOpen', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="ii-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="ii-sky" />

        {/* Forest backdrop (Guindy park overlap) */}
        <ellipse cx="120" cy="200" rx="140" ry="100" fill={PALETTE.forest} opacity="0.25" />
        <ellipse cx="700" cy="190" rx="150" ry="110" fill={PALETTE.forest} opacity="0.25" />

        {/* Research park building — modern, glass-heavy */}
        <rect x="230" y="140" width="340" height="180" fill={PALETTE.navy} opacity="0.55" />
        <g className="ii-windows">
          {Array.from({ length: 5 }).map((_, row) => (
            Array.from({ length: 8 }).map((_, col) => (
              <rect key={`${row}-${col}`} x={240 + col * 40} y={150 + row * 32} width="28" height="22" fill={glow} opacity={(row + col) % 4 === 0 ? 0.7 : 0.25} className="ii-bulb" style={{ animationDelay: `${(row * col) % 6}s` }} />
            ))
          ))}
        </g>

        {/* Whiteboard sketch motif (small foreground card) */}
        <g transform="translate(120,300)" opacity="0.85">
          <rect width="120" height="80" rx="4" fill={PALETTE.cream} opacity="0.9" />
          <path d="M10,50 L40,20 L60,40 L90,15" stroke={PALETTE.terracotta} strokeWidth="3" fill="none" />
          <circle cx="40" cy="20" r="4" fill={PALETTE.navy} />
          <circle cx="90" cy="15" r="4" fill={PALETTE.navy} />
        </g>

        {/* Deer silhouette nod to Guindy park wildlife */}
        <g transform="translate(640,360)" opacity="0.6">
          <path d="M0,20 L18,20 L20,6 L26,6 L24,20 L34,20 L30,30 L4,30 Z" fill="#1a1410" />
        </g>

        {/* Ground */}
        <rect y="340" width="800" height="110" fill={PALETTE.cream} opacity="0.5" />

        <FigureSilhouette pose={figurePose} x={400} y={380} scale={1.2} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .ii-scene { width: 100%; height: 100%; }
        .ii-bulb { animation: ii-flicker 5s ease-in-out infinite; }
        @keyframes ii-flicker { 0%,100% { opacity: 0.3; } 50% { opacity: 0.65; } }
      `}</style>
    </div>
  );
}
