import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function KoyambeduMarket({ mood = 'dawn', figurePose = 'walking', accentColor }) {
  const bloom = accentColor || PALETTE.terracotta;

  return (
    <div className="km-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="km-sky" />

        {/* Market shed roofline, background */}
        <rect x="40" y="120" width="720" height="40" fill={PALETTE.charcoal} opacity="0.4" />
        <g opacity="0.35">
          {Array.from({ length: 12 }).map((_, i) => (
            <polygon key={i} points={`${50 + i * 62},120 ${90 + i * 62},120 ${70 + i * 62},100`} fill={PALETTE.charcoal} />
          ))}
        </g>

        {/* Flower stalls — colorful blocks, midground */}
        <g className="km-flowers">
          {Array.from({ length: 8 }).map((_, i) => {
            const colors = [PALETTE.terracotta, PALETTE.gold, PALETTE.forest, '#d4547a'];
            return <rect key={i} x={70 + i * 88} y={180} width="60" height="36" rx="4" fill={colors[i % colors.length]} opacity="0.6" className="km-bloom" style={{ animationDelay: `${i * 0.3}s` }} />;
          })}
        </g>

        {/* Crates/produce, foreground-mid */}
        <g opacity="0.6">
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={100 + i * 110} y={240} width="70" height="40" fill="#5c3a1a" opacity="0.6" />
          ))}
        </g>

        {/* Crowd silhouettes */}
        <g opacity="0.5" fill="#1a1410">
          <circle cx="220" cy="320" r="6" /><rect x="214" y="326" width="12" height="26" />
          <circle cx="480" cy="318" r="6" /><rect x="474" y="324" width="12" height="26" />
        </g>

        {/* Ground */}
        <rect y="340" width="800" height="110" fill={PALETTE.cream} opacity="0.6" />

        <FigureSilhouette pose={figurePose} x={350} y={360} scale={1.15} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .km-scene { width: 100%; height: 100%; }
        .km-bloom { animation: km-sway 4s ease-in-out infinite; }
        @keyframes km-sway { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>
    </div>
  );
}
