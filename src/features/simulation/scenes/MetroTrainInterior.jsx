import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function MetroTrainInterior({ mood = 'night', figurePose = 'seated', accentColor }) {
  const glow = accentColor || PALETTE.gold;

  return (
    <div className="mt-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="mt-sky" />

        {/* Train interior ceiling + cabin shell */}
        <rect width="800" height="450" fill={PALETTE.charcoal} opacity="0.18" />
        <rect y="0" width="800" height="60" fill="#1a1a1a" opacity="0.6" />
        {/* Overhead handrail */}
        <line x1="80" y1="70" x2="720" y2="70" stroke="#3a3a3a" strokeWidth="4" opacity="0.6" />
        <line x1="220" y1="70" x2="220" y2="110" stroke="#3a3a3a" strokeWidth="3" opacity="0.6" />
        <line x1="580" y1="70" x2="580" y2="110" stroke="#3a3a3a" strokeWidth="3" opacity="0.6" />

        {/* Windows with motion-blur light streaks rushing past */}
        <rect x="40" y="100" width="720" height="140" rx="6" fill="#05080d" opacity="0.85" />
        <g className="mt-streaks">
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={-100} y={110 + i * 13} width="120" height="4" fill={glow} opacity="0.5" className="mt-streak" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </g>
        {/* Window frame mullions */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={40 + i * 120} y={100} width="6" height="140" fill="#2a2a2a" opacity="0.7" />
        ))}

        {/* Seats, foreground */}
        <rect x="80" y="280" width="640" height="60" rx="10" fill={PALETTE.terracotta} opacity="0.35" />
        <rect x="80" y="280" width="640" height="14" rx="6" fill={PALETTE.terracotta} opacity="0.5" />

        {/* Grab poles */}
        <line x1="300" y1="70" x2="300" y2="280" stroke="#3a3a3a" strokeWidth="5" opacity="0.5" className="mt-sway" />
        <line x1="500" y1="70" x2="500" y2="280" stroke="#3a3a3a" strokeWidth="5" opacity="0.5" className="mt-sway" />

        {/* Standing/seated commuter silhouettes */}
        <g opacity="0.6" fill="#0a0a0a">
          <circle cx="150" cy="265" r="9" /><rect x="138" y="273" width="24" height="32" rx="4" />
          <circle cx="640" cy="265" r="9" /><rect x="628" y="273" width="24" height="32" rx="4" />
        </g>

        <FigureSilhouette pose={figurePose} x={400} y={300} scale={1.1} color="#0a0a0a" />
      </SceneRoot>
      <style>{`
        .mt-scene { width: 100%; height: 100%; }
        .mt-streak { animation: mt-rush 1s linear infinite; }
        .mt-sway { animation: mt-rock 2.4s ease-in-out infinite; transform-origin: top; }
        @keyframes mt-rush { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateX(900px); opacity: 0; } }
        @keyframes mt-rock { 0%,100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
      `}</style>
    </div>
  );
}
