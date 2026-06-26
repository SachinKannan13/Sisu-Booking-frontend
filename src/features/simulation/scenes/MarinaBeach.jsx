import { SceneRoot, SkyBackground, FigureSilhouette, ParticleLayer, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function MarinaBeach({ mood = 'dawn', figurePose = 'standing', accentColor }) {
  const sky = getMoodSky(mood);
  const water = mood === 'night' ? '#0d1a2a' : mood === 'midday' ? '#2d6a8f' : '#1a3a5c';
  const beam = accentColor || sky.sun;

  return (
    <div className="ms-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="marina-sky" />

        {/* Sun/light disc */}
        <circle cx="640" cy="120" r="34" fill={sky.sun} opacity={mood === 'night' ? 0.4 : 0.85} className="ms-sun" />

        {/* Background: sea horizon */}
        <rect y="190" width="800" height="100" fill={water} opacity="0.9" />
        <path d="M0,195 Q200,185 400,195 T800,192 L800,230 L0,230 Z" fill={water} opacity="0.6" />

        {/* Midground waves — animated */}
        <g className="ms-waves">
          <path d="M-50,260 Q100,245 250,260 T550,260 T850,260 L850,300 L-50,300 Z" fill={PALETTE.navy} opacity="0.55" />
          <path d="M-50,280 Q150,268 350,280 T750,280 L850,330 L-50,330 Z" fill={PALETTE.navy} opacity="0.4" />
        </g>

        {/* Lighthouse silhouette */}
        <g transform="translate(700,150)">
          <rect x="-8" y="0" width="16" height="90" fill="#2a2a2a" />
          <polygon points="-14,0 14,0 0,-22" fill="#2a2a2a" />
          <rect x="-12" y="-4" width="24" height="8" fill={beam} opacity="0.9" />
          {mood === 'night' && <ellipse cx="0" cy="-4" rx="70" ry="6" fill={beam} opacity="0.25" className="ms-beam" />}
        </g>

        {/* Fishermen boats, small silhouettes */}
        <g opacity="0.7">
          <path d="M120,210 L150,210 L142,200 L128,200 Z" fill="#1a1410" />
          <path d="M220,205 L246,205 L240,197 L226,197 Z" fill="#1a1410" />
        </g>

        {/* Sand foreground */}
        <path d="M0,300 Q200,280 400,300 T800,295 L800,450 L0,450 Z" fill={PALETTE.cream} opacity="0.92" />
        <path d="M0,310 Q250,295 500,312 T800,305 L800,330 L0,330 Z" fill={PALETTE.terracotta} opacity="0.15" />

        {/* Birds */}
        <g className="ms-birds" opacity="0.6" stroke="#2a2a2a" strokeWidth="2" fill="none">
          <path d="M520,90 q8,-8 16,0 q8,-8 16,0" />
          <path d="M560,110 q6,-6 12,0 q6,-6 12,0" />
        </g>

        <FigureSilhouette pose={figurePose} x={250} y={360} scale={1.3} color="#1a1410" />

        {/* Fine sea-mist particles drifting over the water for extra depth */}
        <ParticleLayer variant="dust" count={14} color={PALETTE.cream} opacity={0.3} area={{ x: 0, y: 60, w: 800, h: 200 }} />
      </SceneRoot>

      <style>{`
        .ms-scene { width: 100%; height: 100%; }
        .ms-sun { animation: ms-pulse 6s ease-in-out infinite; }
        .ms-waves { animation: ms-drift 7s ease-in-out infinite; }
        .ms-beam { animation: ms-sweep 4s linear infinite; transform-origin: 700px 146px; }
        .ms-birds { animation: ms-fly 9s ease-in-out infinite; }
        .pl-particle { animation: pl-drift-float 6s ease-in-out infinite; }
        @keyframes ms-pulse { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
        @keyframes ms-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
        @keyframes ms-sweep { 0% { transform: rotate(-25deg); } 50% { transform: rotate(25deg); } 100% { transform: rotate(-25deg); } }
        @keyframes ms-fly { 0%,100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(-14px) translateY(-4px); } }
        @keyframes pl-drift-float { 0%,100% { transform: translate(0,0); opacity: 0.3; } 50% { transform: translate(6px,-8px); opacity: 0.6; } }
      `}</style>
    </div>
  );
}
