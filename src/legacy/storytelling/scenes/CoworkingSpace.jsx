import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function CoworkingSpace({ mood = 'midday', figurePose = 'standing', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="cw-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="cw-sky" />

        {/* Big windows, background, daylight flooding in */}
        <rect x="40" y="40" width="720" height="180" rx="6" fill={PALETTE.navy} opacity="0.15" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={50 + i * 120} y={50} width="100" height="160" fill={PALETTE.cream} opacity="0.1" />
        ))}

        {/* Ceiling fan, rotating */}
        <g transform="translate(400,70)" className="cw-fan">
          <circle r="6" fill="#2a2a2a" opacity="0.7" />
          <rect x="-44" y="-3" width="88" height="6" fill="#2a2a2a" opacity="0.7" />
          <rect x="-3" y="-44" width="6" height="88" fill="#2a2a2a" opacity="0.7" />
        </g>

        {/* Open-plan desks, midground */}
        <g opacity="0.55">
          {[[120, 260], [320, 250], [520, 260], [650, 250]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="100" height="14" fill="#3a2a1f" />
              <rect x={x + 30} y={y - 26} width="40" height="26" rx="2" fill="#1a1a1a" />
              <rect x={x + 34} y={y - 22} width="32" height="18" fill={glow} opacity="0.45" className="cw-screen" style={{ animationDelay: `${i * 0.6}s` }} />
            </g>
          ))}
        </g>

        {/* Whiteboard with sticky notes, a startup-energy detail */}
        <g transform="translate(660,150)" opacity="0.85">
          <rect width="100" height="70" rx="3" fill={PALETTE.cream} opacity="0.9" />
          <rect x="8" y="8" width="14" height="14" fill={PALETTE.terracotta} opacity="0.7" />
          <rect x="28" y="8" width="14" height="14" fill={PALETTE.gold} opacity="0.7" />
          <rect x="8" y="28" width="14" height="14" fill={PALETTE.forest} opacity="0.7" />
        </g>

        {/* Floor */}
        <rect y="340" width="800" height="110" fill={PALETTE.cream} opacity="0.4" />

        {/* Small group silhouettes — collaborative energy */}
        <g opacity="0.6" fill="#1a1410">
          <circle cx="250" cy="360" r="7" /><rect x="241" y="367" width="18" height="26" />
          <circle cx="280" cy="362" r="7" /><rect x="271" y="369" width="18" height="26" />
        </g>

        <FigureSilhouette pose={figurePose} x={420} y={365} scale={1.1} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .cw-scene { width: 100%; height: 100%; }
        .cw-fan { animation: cw-spin 3s linear infinite; }
        .cw-screen { animation: cw-blink 4.5s ease-in-out infinite; }
        @keyframes cw-spin { from { transform: translate(400px,70px) rotate(0deg); } to { transform: translate(400px,70px) rotate(360deg); } }
        @keyframes cw-blink { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}
