import { SceneRoot, SkyBackground, FigureSilhouette, getMoodSky, PALETTE } from './sceneHelpers.jsx';

export default function TNagarStreet({ mood = 'midday', figurePose = 'walking', accentColor }) {
  const sky = getMoodSky(mood);
  const sign = accentColor || PALETTE.terracotta;

  return (
    <div className="tn-scene">
      <SceneRoot>
        <SkyBackground mood={mood} gradientId="tn-sky" />

        {/* Background: shop facades */}
        <rect y="120" width="800" height="200" fill={PALETTE.charcoal} opacity="0.3" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={i * 115} y={130} width="105" height="180" fill={i % 2 === 0 ? PALETTE.terracotta : PALETTE.gold} opacity="0.25" />
        ))}

        {/* Shop signboards */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={i * 115 + 10} y={140} width="85" height="22" rx="3" fill={sign} opacity="0.7" className="tn-sign" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}

        {/* Hanging textile displays */}
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x={i * 115 + 15} y={170} width="6" height="40" fill={PALETTE.cream} opacity="0.6" />
            <rect x={i * 115 + 30} y={172} width="6" height="38" fill={PALETTE.forest} opacity="0.5" />
            <rect x={i * 115 + 45} y={168} width="6" height="42" fill={PALETTE.navy} opacity="0.5" />
          </g>
        ))}

        {/* Street crowd silhouettes (small, background) */}
        <g opacity="0.5" fill="#1a1410">
          <circle cx="180" cy="350" r="6" /><rect x="174" y="356" width="12" height="24" />
          <circle cx="540" cy="345" r="6" /><rect x="534" y="351" width="12" height="26" />
          <circle cx="620" cy="355" r="5" /><rect x="615" y="360" width="10" height="20" />
        </g>

        {/* Autorickshaw silhouette */}
        <g transform="translate(560,370)" className="tn-auto">
          <path d="M0,0 L60,0 L60,-30 Q60,-42 45,-42 L15,-42 Q0,-42 0,-30 Z" fill="#1a1a1a" opacity="0.85" />
          <circle cx="12" cy="6" r="9" fill="#0a0a0a" />
          <circle cx="48" cy="6" r="9" fill="#0a0a0a" />
          <rect x="40" y="-38" width="14" height="10" fill={PALETTE.gold} opacity="0.8" />
        </g>

        {/* Foreground street + crossing lines */}
        <rect y="378" width="800" height="72" fill="#2a2a2a" opacity="0.85" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={i * 70} y="400" width="30" height="8" fill={PALETTE.cream} opacity="0.35" />
        ))}

        <FigureSilhouette pose={figurePose} x={300} y={400} scale={1.2} color="#1a1410" />
      </SceneRoot>

      <style>{`
        .tn-scene { width: 100%; height: 100%; }
        .tn-sign { animation: tn-flicker 5s ease-in-out infinite; }
        .tn-auto { animation: tn-rumble 1.6s ease-in-out infinite; }
        @keyframes tn-flicker { 0%,100% { opacity: 0.6; } 50% { opacity: 0.85; } }
        @keyframes tn-rumble { 0%,100% { transform: translate(560px,370px) translateY(0); } 50% { transform: translate(560px,370px) translateY(-1.5px); } }
      `}</style>
    </div>
  );
}
