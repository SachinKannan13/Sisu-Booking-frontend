import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function GenericOffice({ mood = 'night', figurePose = 'seated', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="go-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="go-sky" />

        {/* City skyline through the window, background */}
        <rect x="60" y="40" width="680" height="260" rx="6" fill={PALETTE.navy} opacity="0.25" />
        <g opacity="0.4">
          {[100, 180, 280, 420, 540, 640].map((x, i) => (
            <rect key={i} x={x} y={120 + (i % 3) * 30} width="40" height={150 - (i % 3) * 30} fill={PALETTE.charcoal} />
          ))}
        </g>
        <g className="go-citylights" opacity="0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={100 + (i % 6) * 90} y={140 + Math.floor(i / 6) * 60} width="8" height="10" fill={glow} className="go-bulb" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>

        {/* Desk + monitor glow, foreground */}
        <rect y="330" width="800" height="120" fill={PALETTE.charcoal} opacity="0.35" />
        <rect x="320" y="300" width="160" height="100" rx="4" fill="#1a1a1a" opacity="0.9" />
        <rect x="332" y="312" width="136" height="70" rx="2" fill={glow} opacity="0.45" className="go-screen" />
        <rect x="380" y="382" width="40" height="14" fill="#2a2a2a" />

        {/* Coffee cup with steam */}
        <ellipse cx="540" cy="390" rx="10" ry="5" fill="#2a2a2a" />
        <path d="M540,384 q4,-8 0,-14" stroke={PALETTE.cream} strokeWidth="2" fill="none" opacity="0.5" className="go-steam" />

        <FigureSilhouette pose={figurePose} x={400} y={400} scale={1} color="#1a1410" />
      </SceneRoot>
      <style>{`
        .go-scene { width: 100%; height: 100%; }
        .go-bulb { animation: go-twinkle 4s ease-in-out infinite; }
        .go-screen { animation: go-flicker 3s ease-in-out infinite; }
        .go-steam { animation: go-rise 3.5s ease-in-out infinite; }
        @keyframes go-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes go-flicker { 0%,100% { opacity: 0.4; } 50% { opacity: 0.55; } }
        @keyframes go-rise { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-14px); } }
      `}</style>
    </div>
  );
}
