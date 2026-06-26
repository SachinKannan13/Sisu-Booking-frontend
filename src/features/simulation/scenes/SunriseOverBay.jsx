import { SceneRoot, SkyBackground, getMoodSky, PALETTE } from './sceneHelpers.jsx';

// Wide establishing shot — intentionally figure-less (opening/closing beats
// where the story needs scale and atmosphere, not a personal moment).
// figurePose is accepted for prop-shape consistency with other templates
// but deliberately ignored.
export default function SunriseOverBay({ mood = 'dawn', accentColor }) {
  const sky = getMoodSky(mood);
  const sunColor = accentColor || sky.sun;

  return (
    <div className="sb-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="sb-sky" />

        {/* Drifting cloud bands, layered for depth */}
        <g className="sb-clouds-far" opacity="0.35">
          <ellipse cx="150" cy="70" rx="90" ry="16" fill={PALETTE.cream} />
          <ellipse cx="600" cy="55" rx="110" ry="18" fill={PALETTE.cream} />
        </g>
        <g className="sb-clouds-near" opacity="0.5">
          <ellipse cx="380" cy="110" rx="130" ry="20" fill={PALETTE.cream} />
          <ellipse cx="720" cy="130" rx="80" ry="14" fill={PALETTE.cream} />
        </g>

        {/* Sun disc, rising right at the horizon */}
        <circle cx="400" cy="230" r="60" fill={sunColor} className="sb-sun" opacity="0.95" />
        <circle cx="400" cy="230" r="90" fill={sunColor} opacity="0.18" />

        {/* The bay — vast, calm, horizon-dominant */}
        <rect y="240" width="800" height="210" fill={PALETTE.navy} opacity="0.75" />
        <g className="sb-glitter" opacity="0.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <rect key={i} x={(i * 47) % 800} y={250 + (i % 5) * 28} width="26" height="3" fill={sunColor} className="sb-shimmer" style={{ animationDelay: `${(i % 6) * 0.4}s` }} />
          ))}
        </g>

        {/* Distant fishing boat silhouettes for scale */}
        <g opacity="0.6">
          <path d="M140,300 L170,300 L162,292 L148,292 Z" fill="#1a1410" />
          <path d="M620,320 L650,320 L642,312 L628,312 Z" fill="#1a1410" />
        </g>

        {/* Birds, very small, far */}
        <g className="sb-birds" opacity="0.5" stroke="#1a1410" strokeWidth="1.5" fill="none">
          <path d="M500,150 q6,-6 12,0 q6,-6 12,0" />
        </g>
      </SceneRoot>
      <style>{`
        .sb-scene { width: 100%; height: 100%; }
        .sb-clouds-far { animation: sb-driftA 14s linear infinite; }
        .sb-clouds-near { animation: sb-driftB 10s linear infinite; }
        .sb-sun { animation: sb-rise 8s ease-in-out infinite; }
        .sb-shimmer { animation: sb-twinkle 3s ease-in-out infinite; }
        .sb-birds { animation: sb-fly 7s ease-in-out infinite; }
        @keyframes sb-driftA { 0% { transform: translateX(0); } 100% { transform: translateX(60px); } }
        @keyframes sb-driftB { 0% { transform: translateX(0); } 100% { transform: translateX(-50px); } }
        @keyframes sb-rise { 0%,100% { opacity: 0.9; } 50% { opacity: 1; } }
        @keyframes sb-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes sb-fly { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-20px); } }
      `}</style>
    </div>
  );
}
