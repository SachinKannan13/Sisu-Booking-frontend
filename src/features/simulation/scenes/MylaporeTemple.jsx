import { SceneRoot, SkyBackground, FigureSilhouette, ParticleLayer, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function MylaporeTemple({ mood = 'dawn', figurePose = 'standing', accentColor }) {
  const glow = accentColor || PALETTE.gold;
  const tiers = 5;

  return (
    <div className="my-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="my-sky" />

        {/* Gopuram — tiered pyramid silhouette */}
        <g transform="translate(400,60)">
          {Array.from({ length: tiers }).map((_, i) => {
            const w = 220 - i * 34;
            const y = i * 38;
            return (
              <g key={i}>
                <polygon points={`${-w / 2},${y + 38} ${w / 2},${y + 38} ${w / 2 - 14},${y} ${-w / 2 + 14},${y}`} fill={PALETTE.terracotta} opacity={0.55 + i * 0.06} />
                {Array.from({ length: 4 }).map((_, j) => (
                  <circle key={j} cx={-w / 2 + 20 + j * (w - 40) / 3} cy={y + 24} r="5" fill={glow} className="my-lamp" opacity="0.7" style={{ animationDelay: `${(i + j) * 0.3}s` }} />
                ))}
              </g>
            );
          })}
          <rect x="-30" y="-26" width="60" height="30" fill={PALETTE.terracotta} opacity="0.8" />
          <circle cx="0" cy="-30" r="10" fill={glow} opacity="0.8" />
        </g>

        {/* Temple base + tank */}
        <rect y="270" width="800" height="80" fill={PALETTE.charcoal} opacity="0.3" />
        <ellipse cx="400" cy="340" rx="260" ry="34" fill={PALETTE.navy} opacity="0.5" className="my-tank" />

        {/* Flower vendor stalls (small color blocks) */}
        <g opacity="0.7">
          <rect x="100" y="300" width="40" height="24" fill={PALETTE.forest} />
          <rect x="650" y="300" width="40" height="24" fill={PALETTE.gold} />
        </g>

        {/* Foreground courtyard */}
        <rect y="360" width="800" height="90" fill={PALETTE.cream} opacity="0.85" />

        <FigureSilhouette pose={figurePose} x={400} y={380} scale={1.2} color="#1a1410" />

        {/* Incense smoke / fine dust drifting up past the gopuram */}
        <ParticleLayer variant="dust" count={10} color={PALETTE.cream} opacity={0.3} area={{ x: 320, y: 80, w: 160, h: 180 }} />
      </SceneRoot>
      <style>{`
        .my-scene { width: 100%; height: 100%; }
        .my-lamp { animation: my-blink 3s ease-in-out infinite; }
        .my-tank { animation: my-shimmer 6s ease-in-out infinite; }
        .pl-particle { animation: pl-drift-rise 5s ease-in-out infinite; }
        @keyframes my-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.95; } }
        @keyframes my-shimmer { 0%,100% { opacity: 0.45; } 50% { opacity: 0.6; } }
        @keyframes pl-drift-rise { 0% { transform: translateY(0); opacity: 0.15; } 50% { opacity: 0.45; } 100% { transform: translateY(-22px); opacity: 0; } }
      `}</style>
    </div>
  );
}
