import { SceneRoot, SkyBackground, FigureSilhouette, ParticleLayer, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function OMRTechPark({ mood = 'night', figurePose = 'walking', accentColor }) {
  const sky = getMoodSky(mood);
  const glow = accentColor || PALETTE.gold;
  const litWindow = mood === 'night' ? 0.85 : 0.35;

  const towers = [
    { x: 90, w: 90, h: 220 }, { x: 200, w: 70, h: 280 }, { x: 290, w: 100, h: 240 },
    { x: 420, w: 80, h: 310 }, { x: 520, w: 110, h: 260 }, { x: 650, w: 85, h: 230 }
  ];

  return (
    <div className="ot-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="ot-sky" />

        {/* Background haze layer */}
        <rect y="120" width="800" height="330" fill={PALETTE.navy} opacity="0.15" />

        {/* Glass towers — midground/background depth via opacity */}
        {towers.map((t, i) => (
          <g key={i} opacity={0.55 + (i % 2) * 0.25}>
            <rect x={t.x} y={450 - t.h} width={t.w} height={t.h} fill={PALETTE.navy} opacity="0.9" />
            {Array.from({ length: Math.floor(t.h / 24) }).map((_, row) => (
              Array.from({ length: Math.floor(t.w / 20) }).map((_, col) => {
                const lit = (row + col + i) % 3 === 0;
                return lit ? (
                  <rect
                    key={`${row}-${col}`}
                    x={t.x + 4 + col * 20}
                    y={450 - t.h + 6 + row * 24}
                    width="12" height="14"
                    fill={glow}
                    opacity={litWindow}
                    className="ot-window"
                    style={{ animationDelay: `${(row * col + i) % 5}s` }}
                  />
                ) : null;
              })
            ))}
          </g>
        ))}

        {/* Foreground road */}
        <rect y="400" width="800" height="50" fill="#1a1a1a" opacity="0.9" />
        <g className="ot-lane">
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={i * 90 - 20} y="423" width="40" height="4" fill={PALETTE.cream} opacity="0.4" />
          ))}
        </g>

        {/* Moving headlight/traffic dots */}
        <g className="ot-traffic">
          <circle cx="60" cy="412" r="4" fill={PALETTE.gold} opacity="0.9" />
          <circle cx="180" cy="436" r="3" fill={PALETTE.terracotta} opacity="0.8" />
        </g>

        <FigureSilhouette pose={figurePose} x={400} y={395} scale={1.15} color="#0a0a0a" />

        {/* Haze/dust motes hanging in the humid night air over the highway */}
        <ParticleLayer variant="dust" count={14} color={glow} opacity={0.25} area={{ x: 0, y: 150, w: 800, h: 220 }} />
      </SceneRoot>

      <style>{`
        .ot-scene { width: 100%; height: 100%; }
        .ot-window { animation: ot-flicker 6s ease-in-out infinite; }
        .ot-lane { animation: ot-dash 1.2s linear infinite; }
        .ot-traffic circle:nth-child(1) { animation: ot-move 3s linear infinite; }
        .ot-traffic circle:nth-child(2) { animation: ot-move 4s linear infinite reverse; }
        .pl-particle { animation: pl-drift-float 7s ease-in-out infinite; }
        @keyframes ot-flicker { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        @keyframes ot-dash { 0% { transform: translateX(0); } 100% { transform: translateX(90px); } }
        @keyframes ot-move { 0% { transform: translateX(0); } 100% { transform: translateX(700px); } }
        @keyframes pl-drift-float { 0%,100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(8px,-6px); opacity: 0.4; } }
      `}</style>
    </div>
  );
}
