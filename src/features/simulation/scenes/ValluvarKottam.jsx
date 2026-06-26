import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function ValluvarKottamScene({ mood = 'midday', figurePose = 'standing', accentColor }) {
  const stone = accentColor || PALETTE.terracotta;

  return (
    <div className="vk-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="vk-sky" />

        {/* Chariot monument — stepped pyramid form with wheel motif */}
        <g transform="translate(400,70)">
          <polygon points="-90,220 90,220 60,30 -60,30" fill={stone} opacity="0.6" />
          <polygon points="-60,30 60,30 30,-10 -30,-10" fill={stone} opacity="0.75" />
          <rect x="-14" y="-30" width="28" height="20" fill={stone} opacity="0.85" />
          {/* wheel */}
          <circle cx="-90" cy="222" r="26" fill="none" stroke={stone} strokeWidth="5" opacity="0.7" className="vk-wheel" />
          <circle cx="90" cy="222" r="26" fill="none" stroke={stone} strokeWidth="5" opacity="0.7" className="vk-wheel" />
        </g>

        {/* Amphitheater steps, foreground */}
        <g opacity="0.4">
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} y={330 + i * 14} width="800" height="10" fill={PALETTE.charcoal} opacity={0.2 + i * 0.05} />
          ))}
        </g>

        {/* Lawn foreground */}
        <rect y="390" width="800" height="60" fill={PALETTE.forest} opacity="0.3" />

        {/* Joggers/visitors small silhouettes */}
        <g opacity="0.5" fill="#1a1410">
          <circle cx="180" cy="400" r="5" /><rect x="175" y="405" width="10" height="18" />
          <circle cx="620" cy="405" r="5" /><rect x="615" y="410" width="10" height="18" />
        </g>

        <FigureSilhouette pose={figurePose} x={400} y={400} scale={1.2} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .vk-scene { width: 100%; height: 100%; }
        .vk-wheel { animation: vk-spin 14s linear infinite; transform-origin: center; }
        @keyframes vk-spin { from { stroke-dasharray: 0 200; } to { stroke-dasharray: 200 0; } }
      `}</style>
    </div>
  );
}
