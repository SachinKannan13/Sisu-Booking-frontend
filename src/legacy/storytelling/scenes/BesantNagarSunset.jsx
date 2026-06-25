import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function BesantNagarSunset({ mood = 'goldenHour', figurePose = 'seated', accentColor }) {
  const sky = getMoodSky(mood);
  const sun = accentColor || sky.sun;

  return (
    <div className="bn-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="bn-sky" />

        {/* Sun low over the water */}
        <circle cx="420" cy="200" r="46" fill={sun} className="bn-sun" opacity="0.9" />
        <circle cx="420" cy="200" r="70" fill={sun} opacity="0.18" />

        {/* Sea */}
        <rect y="220" width="800" height="90" fill={PALETTE.navy} opacity="0.7" />
        <g className="bn-glitter" opacity="0.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={i * 58} y={236 + (i % 3) * 8} width="22" height="3" fill={sun} />
          ))}
        </g>

        {/* Karl Schmidt Memorial silhouette ("the Ship") */}
        <g transform="translate(560,250)" opacity="0.85">
          <path d="M0,40 L70,40 L60,10 L10,10 Z" fill="#1a1410" />
          <rect x="30" y="-10" width="6" height="22" fill="#1a1410" />
        </g>

        {/* Sand */}
        <path d="M0,300 Q200,285 400,302 T800,295 L800,450 L0,450 Z" fill={PALETTE.cream} opacity="0.92" />

        {/* Couples/families silhouettes, small, background */}
        <g opacity="0.5" fill="#1a1410">
          <circle cx="160" cy="340" r="5" /><rect x="155" y="345" width="10" height="20" />
          <circle cx="180" cy="340" r="5" /><rect x="175" y="345" width="10" height="20" />
        </g>

        <FigureSilhouette pose={figurePose} x={330} y={355} scale={1.15} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .bn-scene { width: 100%; height: 100%; }
        .bn-sun { animation: bn-glow 6s ease-in-out infinite; }
        .bn-glitter rect { animation: bn-twinkle 3s ease-in-out infinite; }
        @keyframes bn-glow { 0%,100% { opacity: 0.85; r: 46px; } 50% { opacity: 1; r: 49px; } }
        @keyframes bn-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}
