import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function RooftopNightView({ mood = 'night', figurePose = 'standing', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="rt-scene">
      <SceneRoot>
        <SkyBackground mood="night" gradientId="rt-sky" />

        {/* Stars */}
        <g className="rt-stars" opacity="0.7">
          {Array.from({ length: 24 }).map((_, i) => (
            <circle key={i} cx={(i * 53) % 800} cy={20 + (i * 31) % 140} r={i % 5 === 0 ? 2.2 : 1.1} fill={PALETTE.cream} className="rt-star" style={{ animationDelay: `${(i % 8) * 0.4}s` }} />
          ))}
        </g>

        {/* City skyline, wide and far below */}
        <g opacity="0.5">
          {[40, 120, 200, 290, 380, 470, 560, 650, 730].map((x, i) => (
            <rect key={i} x={x} y={250 - (i % 4) * 30} width="60" height={200 + (i % 4) * 30} fill={PALETTE.navy} />
          ))}
        </g>
        {/* Twinkling window lights across the skyline */}
        <g className="rt-lights" opacity="0.6">
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i} x={50 + (i * 26) % 720} y={260 + (i * 17) % 170} width="6" height="8" fill={glow} className="rt-bulb" style={{ animationDelay: `${(i % 7) * 0.5}s` }} />
          ))}
        </g>

        {/* Rooftop ledge, foreground, wide establishing silhouette */}
        <rect y="380" width="800" height="70" fill="#0a0a0a" opacity="0.9" />
        <rect y="372" width="800" height="14" fill="#1a1a1a" opacity="0.9" />
        {/* Water tank / antenna silhouettes for rooftop authenticity */}
        <g opacity="0.7" fill="#0a0a0a">
          <rect x="630" y="320" width="50" height="55" rx="4" />
          <line x1="100" y1="300" x2="100" y2="372" stroke="#0a0a0a" strokeWidth="4" />
          <line x1="90" y1="300" x2="110" y2="300" stroke="#0a0a0a" strokeWidth="4" />
        </g>

        <FigureSilhouette pose={figurePose} x={400} y={375} scale={1.25} color="#0a0a0a" />
      </SceneRoot>
      <style>{`
        .rt-scene { width: 100%; height: 100%; }
        .rt-star { animation: rt-twinkle 4s ease-in-out infinite; }
        .rt-bulb { animation: rt-flicker 5s ease-in-out infinite; }
        @keyframes rt-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 0.9; } }
        @keyframes rt-flicker { 0%,100% { opacity: 0.35; } 50% { opacity: 0.75; } }
      `}</style>
    </div>
  );
}
