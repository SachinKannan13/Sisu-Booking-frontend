import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function FortStGeorge({ mood = 'midday', figurePose = 'standing', accentColor }) {
  const flag = accentColor || PALETTE.terracotta;

  return (
    <div className="fg-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="fg-sky" />

        {/* Fort ramparts, background */}
        <rect x="0" y="200" width="800" height="60" fill={PALETTE.charcoal} opacity="0.4" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={i * 60} y={190} width="30" height="20" fill={PALETTE.charcoal} opacity="0.4" />
        ))}

        {/* Main colonial building */}
        <rect x="220" y="120" width="360" height="120" fill={PALETTE.cream} opacity="0.55" />
        <polygon points="220,120 580,120 400,80" fill={PALETTE.terracotta} opacity="0.6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={250 + i * 50} y={150} width="24" height="50" fill={PALETTE.navy} opacity="0.3" />
        ))}

        {/* Flagpole with flag */}
        <g transform="translate(400,40)">
          <rect x="-2" y="0" width="4" height="80" fill="#2a2a2a" />
          <rect x="2" y="0" width="36" height="20" fill={flag} opacity="0.85" className="fg-flag" />
        </g>

        {/* Cannon silhouettes, foreground */}
        <g opacity="0.7" transform="translate(140,280)">
          <ellipse cx="0" cy="20" rx="14" ry="8" fill="#1a1410" />
          <rect x="-4" y="-10" width="8" height="32" rx="4" fill="#1a1410" transform="rotate(-20)" />
        </g>

        {/* Ground */}
        <rect y="300" width="800" height="150" fill={PALETTE.cream} opacity="0.55" />

        <FigureSilhouette pose={figurePose} x={420} y={340} scale={1.2} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .fg-scene { width: 100%; height: 100%; }
        .fg-flag { animation: fg-wave 2.4s ease-in-out infinite; transform-origin: left center; }
        @keyframes fg-wave { 0%,100% { transform: skewY(0deg); } 50% { transform: skewY(6deg); } }
      `}</style>
    </div>
  );
}
