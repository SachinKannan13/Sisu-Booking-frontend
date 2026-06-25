import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function ChennaiCentralStation({ mood = 'dawn', figurePose = 'walking', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="cc-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="cc-sky" />

        {/* Colonial red-brick facade, background */}
        <rect x="60" y="120" width="680" height="200" fill={PALETTE.terracotta} opacity="0.55" />
        <rect x="60" y="120" width="680" height="14" fill="#3a1f1a" opacity="0.5" />

        {/* Clock tower, the iconic centerpiece */}
        <g transform="translate(400,40)">
          <rect x="-22" y="40" width="44" height="120" fill={PALETTE.terracotta} opacity="0.8" />
          <polygon points="-30,40 30,40 0,0" fill="#3a1f1a" opacity="0.8" />
          <circle cx="0" cy="55" r="20" fill={PALETTE.cream} opacity="0.95" />
          <line x1="0" y1="55" x2="0" y2="42" stroke="#1a1410" strokeWidth="2" className="cc-hand-h" />
          <line x1="0" y1="55" x2="10" y2="55" stroke="#1a1410" strokeWidth="2" className="cc-hand-m" />
        </g>

        {/* Arched windows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M${100 + i * 100},230 v40 a20,20 0 0 0 40,0 v-40 z`} fill={glow} opacity={mood === 'night' ? 0.7 : 0.3} className="cc-window" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}

        {/* Platform foreground */}
        <rect y="320" width="800" height="130" fill={PALETTE.charcoal} opacity="0.5" />
        <rect y="400" width="800" height="14" fill="#2a2a2a" />

        {/* Train silhouette edge */}
        <rect x="0" y="370" width="220" height="40" fill="#1a1410" opacity="0.8" />
        <rect x="0" y="375" width="220" height="10" fill={glow} opacity="0.5" />

        {/* Porters/crowd silhouettes */}
        <g opacity="0.55" fill="#1a1410">
          <circle cx="600" cy="395" r="6" /><rect x="594" y="401" width="12" height="24" />
          <circle cx="650" cy="398" r="5" /><rect x="645" y="403" width="10" height="20" />
        </g>

        <FigureSilhouette pose={figurePose} x={420} y={400} scale={1.2} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .cc-scene { width: 100%; height: 100%; }
        .cc-hand-h { animation: cc-tick 12s linear infinite; transform-origin: 400px 95px; }
        .cc-hand-m { animation: cc-tick 4s linear infinite; transform-origin: 400px 95px; }
        .cc-window { animation: cc-glow 5s ease-in-out infinite; }
        @keyframes cc-tick { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cc-glow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.55; } }
      `}</style>
    </div>
  );
}
