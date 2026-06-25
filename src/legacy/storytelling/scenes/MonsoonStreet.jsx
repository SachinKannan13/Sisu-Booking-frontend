import { SceneRoot, SkyBackground, FigureSilhouette, ParticleLayer, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function MonsoonStreet({ mood = 'rain', figurePose = 'walking', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="rn-scene">
      <SceneRoot>
        <SkyBackground mood="rain" gradientId="rn-sky" />

        {/* Background shopfronts, blurred by rain haze */}
        <rect y="120" width="800" height="180" fill={PALETTE.charcoal} opacity="0.25" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={i * 135} y={140} width="115" height="140" fill={PALETTE.navy} opacity="0.2" />
        ))}
        {/* Lit shop windows glowing through the rain */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={i * 135 + 30} y={170} width="50" height="40" fill={glow} opacity="0.3" className="rn-window" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}

        {/* Rain streaks, full-frame */}
        <g className="rn-rain" opacity="0.45" stroke={PALETTE.cream} strokeWidth="1.5">
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={i} x1={(i * 37) % 800} y1={-10} x2={(i * 37) % 800 - 18} y2={120} className="rn-drop" style={{ animationDelay: `${(i % 10) * 0.15}s` }} />
          ))}
        </g>

        {/* Wet road, foreground, with reflective sheen */}
        <rect y="320" width="800" height="130" fill="#1a1a1a" opacity="0.85" />
        <g className="rn-reflect" opacity="0.4">
          <rect x="60" y="330" width="50" height="12" fill={glow} />
          <rect x="320" y="335" width="60" height="14" fill={glow} />
          <rect x="600" y="330" width="50" height="12" fill={glow} />
        </g>

        {/* Puddle ripples */}
        <g className="rn-ripple" opacity="0.4">
          <ellipse cx="260" cy="380" rx="30" ry="6" fill="none" stroke={PALETTE.cream} strokeWidth="1.5" />
          <ellipse cx="520" cy="400" rx="24" ry="5" fill="none" stroke={PALETTE.cream} strokeWidth="1.5" />
        </g>

        {/* Umbrella silhouettes drifting past */}
        <g className="rn-umbrella-1" opacity="0.75">
          <path d="M0,0 a26,16 0 0 1 52,0 z" fill="#1a1410" transform="translate(180,300)" />
          <line x1="206" y1="300" x2="206" y2="340" stroke="#1a1410" strokeWidth="3" />
        </g>
        <g className="rn-umbrella-2" opacity="0.6">
          <path d="M0,0 a22,14 0 0 1 44,0 z" fill="#1a1410" transform="translate(540,290)" />
          <line x1="562" y1="290" x2="562" y2="324" stroke="#1a1410" strokeWidth="3" />
        </g>

        <FigureSilhouette pose={figurePose} x={380} y={395} scale={1.1} color="#0a0a0a" />

        {/* A finer secondary mist of rain on top of the main streaks, for depth */}
        <ParticleLayer variant="rain" count={20} color={glow} opacity={0.2} area={{ x: 0, y: 0, w: 800, h: 320 }} />
      </SceneRoot>
      <style>{`
        .rn-scene { width: 100%; height: 100%; }
        .rn-window { animation: rn-glow 4s ease-in-out infinite; }
        .rn-drop { animation: rn-fall 0.7s linear infinite; }
        .rn-ripple ellipse { animation: rn-expand 3s ease-out infinite; }
        .rn-umbrella-1 { animation: rn-drift1 9s linear infinite; }
        .rn-umbrella-2 { animation: rn-drift2 11s linear infinite; }
        .pl-raindrop { animation: pl-mist-fall 0.9s linear infinite; }
        @keyframes rn-glow { 0%,100% { opacity: 0.25; } 50% { opacity: 0.45; } }
        @keyframes rn-fall { 0% { transform: translateY(-20px); opacity: 0; } 30% { opacity: 0.5; } 100% { transform: translateY(140px); opacity: 0; } }
        @keyframes rn-expand { 0% { opacity: 0.5; transform: scale(0.6); } 100% { opacity: 0; transform: scale(1.4); } }
        @keyframes rn-drift1 { 0% { transform: translateX(0); } 100% { transform: translateX(80px); } }
        @keyframes rn-drift2 { 0% { transform: translateX(0); } 100% { transform: translateX(-60px); } }
        @keyframes pl-mist-fall { 0% { transform: translateY(-14px); opacity: 0; } 30% { opacity: 0.4; } 100% { transform: translateY(160px); opacity: 0; } }
      `}</style>
    </div>
  );
}
