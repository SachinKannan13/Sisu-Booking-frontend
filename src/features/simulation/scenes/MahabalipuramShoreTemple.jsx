import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function MahabalipuramShoreTemple({ mood = 'dawn', figurePose = 'standing', accentColor }) {
  const sky = getMoodSky(mood);
  const stone = accentColor || PALETTE.terracotta;

  return (
    <div className="sh-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="sh-sky" />

        <circle cx="620" cy="110" r="36" fill={sky.sun} opacity="0.8" className="sh-sun" />

        {/* Sea behind the temple */}
        <rect y="180" width="800" height="100" fill={PALETTE.navy} opacity="0.7" />
        <g className="sh-waves" opacity="0.4">
          <path d="M-50,230 Q150,218 350,230 T750,228 L850,260 L-50,260 Z" fill={PALETTE.navy} />
        </g>

        {/* Shore Temple — stepped pyramidal stone structure */}
        <g transform="translate(360,90)">
          <polygon points="-60,180 60,180 40,20 -40,20" fill={stone} opacity="0.75" />
          <polygon points="-40,20 40,20 22,-20 -22,-20" fill={stone} opacity="0.85" />
          <rect x="-10" y="-32" width="20" height="14" fill={stone} opacity="0.9" />
          {/* secondary smaller shrine */}
          <polygon points="80,180 130,180 118,140 92,140" fill={stone} opacity="0.6" />
        </g>

        {/* Wind-worn rock formations, foreground */}
        <g opacity="0.5">
          <ellipse cx="600" cy="290" rx="40" ry="18" fill={PALETTE.charcoal} />
          <ellipse cx="650" cy="300" rx="26" ry="12" fill={PALETTE.charcoal} />
        </g>

        {/* Sand foreground */}
        <path d="M0,300 Q200,288 400,302 T800,295 L800,450 L0,450 Z" fill={PALETTE.cream} opacity="0.9" />

        <FigureSilhouette pose={figurePose} x={200} y={360} scale={1.2} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .sh-scene { width: 100%; height: 100%; }
        .sh-sun { animation: sh-glow 6s ease-in-out infinite; }
        .sh-waves { animation: sh-drift 7s ease-in-out infinite; }
        @keyframes sh-glow { 0%,100% { opacity: 0.7; } 50% { opacity: 0.95; } }
        @keyframes sh-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(12px); } }
      `}</style>
    </div>
  );
}
