import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function BoardroomPitch({ mood = 'midday', figurePose = 'standing', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="bp-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="bp-sky" />

        {/* City view through boardroom glass wall, background */}
        <rect x="0" y="60" width="800" height="220" fill={PALETTE.navy} opacity="0.2" />
        <g opacity="0.3">
          {[60, 160, 260, 540, 640, 720].map((x, i) => (
            <rect key={i} x={x} y={120 + (i % 3) * 30} width="50" height={140 - (i % 3) * 25} fill={PALETTE.charcoal} />
          ))}
        </g>

        {/* Presentation screen — the focal point */}
        <rect x="290" y="80" width="220" height="130" rx="4" fill="#0d0d0d" opacity="0.9" />
        <rect x="300" y="90" width="200" height="110" rx="2" fill={glow} opacity="0.4" className="bp-screen" />
        <rect x="320" y="105" width="100" height="8" rx="2" fill={PALETTE.cream} opacity="0.6" />
        <rect x="320" y="125" width="160" height="50" rx="2" fill={PALETTE.cream} opacity="0.2" />

        {/* Long boardroom table, foreground */}
        <ellipse cx="400" cy="340" rx="320" ry="50" fill="#2a1f17" opacity="0.85" />
        <ellipse cx="400" cy="332" rx="300" ry="42" fill="#3a2a1f" opacity="0.5" />

        {/* Seated silhouettes around the table, listening */}
        <g opacity="0.7" fill="#1a1410">
          <circle cx="200" cy="320" r="9" /><rect x="188" y="328" width="24" height="30" rx="4" />
          <circle cx="600" cy="320" r="9" /><rect x="588" y="328" width="24" height="30" rx="4" />
          <circle cx="290" cy="305" r="8" /><rect x="279" y="312" width="22" height="26" rx="4" />
          <circle cx="510" cy="305" r="8" /><rect x="499" y="312" width="22" height="26" rx="4" />
        </g>

        {/* Laptops/glow on table */}
        <g className="bp-laptops" opacity="0.6">
          <rect x="180" y="312" width="20" height="3" fill={glow} />
          <rect x="600" y="312" width="20" height="3" fill={glow} />
        </g>

        <FigureSilhouette pose={figurePose} x={400} y={310} scale={1.1} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .bp-scene { width: 100%; height: 100%; }
        .bp-screen { animation: bp-flicker 3s ease-in-out infinite; }
        .bp-laptops rect { animation: bp-blink 4s ease-in-out infinite; }
        @keyframes bp-flicker { 0%,100% { opacity: 0.35; } 50% { opacity: 0.5; } }
        @keyframes bp-blink { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
