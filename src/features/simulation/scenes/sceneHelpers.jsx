import { motion } from 'framer-motion';

// Shared palette — matches the rest of the storytelling/chat visual system.
export const PALETTE = {
  terracotta: '#c85250',
  navy: '#1a3a5c',
  gold: '#f5a623',
  cream: '#faf0e6',
  forest: '#2d6a4f',
  charcoal: '#4a4a4a'
};

// Sky/light gradients per mood — used by every scene's background layer.
export const MOOD_SKY = {
  dawn: { top: '#2a3a5c', mid: '#c85250', bottom: '#f5a623', sun: '#faf0e6', ambient: '#f5a623' },
  midday: { top: '#3d6a8f', mid: '#7ba7c9', bottom: '#cfe6f0', sun: '#faf0e6', ambient: '#cfe6f0' },
  goldenHour: { top: '#5c3a1a', mid: '#c85250', bottom: '#f5a623', sun: '#fff2cc', ambient: '#f5a623' },
  night: { top: '#070b14', mid: '#101a30', bottom: '#1a3a5c', sun: '#cfe6f0', ambient: '#1a3a5c' },
  rain: { top: '#2a2f3a', mid: '#41495c', bottom: '#6b7588', sun: '#cfe6f0', ambient: '#41495c' }
};

export function getMoodSky(mood) {
  return MOOD_SKY[mood] || MOOD_SKY.midday;
}

/**
 * A simple geometric human silhouette whose posture communicates the
 * slide's emotional beat. Intentionally abstract (no detailed anatomy) —
 * a head, torso/cloak triangle, and two limb lines whose angles change
 * per pose. Returns null for 'none' (wide establishing shots).
 */
export function FigureSilhouette({ pose = 'standing', x = 400, y = 330, scale = 1, color = '#1a1410' }) {
  if (!pose || pose === 'none') return null;

  const poses = {
    standing: { headDy: 0, torsoRot: 0, armL: 'M -10,18 L -22,40', armR: 'M 10,18 L 22,40', legL: 'M -6,55 L -10,90', legR: 'M 6,55 L 10,90' },
    walking: { headDy: -1, torsoRot: 4, armL: 'M -10,18 L -26,36', armR: 'M 10,18 L 18,42', legL: 'M -6,55 L -18,88', legR: 'M 6,55 L 16,86' },
    armsOpen: { headDy: -3, torsoRot: 0, armL: 'M -10,16 L -36,4', armR: 'M 10,16 L 36,4', legL: 'M -6,55 L -10,90', legR: 'M 6,55 L 10,90' },
    slumped: { headDy: 10, torsoRot: 10, armL: 'M -8,24 L -16,50', armR: 'M 12,22 L 18,48', legL: 'M -6,55 L -10,88', legR: 'M 6,55 L 8,88' },
    seated: { headDy: 2, torsoRot: 0, armL: 'M -10,18 L -20,32', armR: 'M 10,18 L 20,32', legL: 'M -6,40 L -24,52', legR: 'M 6,40 L 24,52' }
  };
  const p = poses[pose] || poses.standing;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity="0.88">
      <g transform={`rotate(${p.torsoRot})`}>
        <circle cx="0" cy={-22 + p.headDy} r="7" fill={color} />
        <path d={`M -12,18 Q 0,${-4 + p.headDy} 12,18 L 8,55 L -8,55 Z`} fill={color} />
        <path d={p.armL} stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d={p.armR} stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d={p.legL} stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d={p.legR} stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** Drifting cloud layer — reused across outdoor scenes. */
export function DriftingClouds({ color = '#faf0e6', opacity = 0.5, count = 3, className }) {
  return (
    <g className={className} opacity={opacity}>
      {Array.from({ length: count }).map((_, i) => (
        <ellipse key={i} cx={120 + i * 260} cy={50 + (i % 2) * 22} rx="55" ry="14" fill={color} />
      ))}
    </g>
  );
}

/** Generic animated wrapper every scene root uses for ambient drift + fade-in. */
export function SceneRoot({ children, viewBox = '0 0 800 450' }) {
  return (
    <motion.svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.svg>
  );
}

/**
 * A lightweight top-layer of small animated dots/streaks for extra
 * atmospheric depth — dust motes, light particles, or fine rain mist.
 * Pure SVG + CSS, no canvas/WebGL, consistent with the rest of the system.
 *
 * Positions are derived deterministically from the index (not Math.random())
 * so repeated renders of the same scene don't visually "jump."
 *
 * IMPORTANT: this component only renders the SVG shapes — each scene that
 * uses it must also include the `.pl-particle` / `.pl-raindrop` keyframes
 * in its own <style> block (same self-contained pattern every other scene
 * already follows). Copy the snippet from MarinaBeach.jsx or MonsoonStreet.jsx.
 */
export function ParticleLayer({ variant = 'dust', count = 16, color = PALETTE.cream, opacity = 0.4, area = { x: 0, y: 0, w: 800, h: 450 } }) {
  const items = Array.from({ length: count }).map((_, i) => ({
    x: area.x + (i * 53 + 17) % area.w,
    y: area.y + (i * 37 + 11) % area.h,
    size: i % 4 === 0 ? 2.2 : 1.2,
    delay: (i % 9) * 0.3
  }));

  if (variant === 'rain') {
    return (
      <g className="pl-rain" opacity={opacity} stroke={color} strokeWidth="1.2">
        {items.map((p, i) => (
          <line key={i} x1={p.x} y1={p.y} x2={p.x - 8} y2={p.y + 22} className="pl-raindrop" style={{ animationDelay: `${p.delay}s` }} />
        ))}
      </g>
    );
  }

  return (
    <g className={`pl-${variant}`} opacity={opacity}>
      {items.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={color} className="pl-particle" style={{ animationDelay: `${p.delay}s` }} />
      ))}
    </g>
  );
}

/** Standard sky background rect + gradient defs id, shared by every scene. */
export function SkyBackground({ mood, gradientId }) {
  const sky = getMoodSky(mood);
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} />
          <stop offset="55%" stopColor={sky.mid} />
          <stop offset="100%" stopColor={sky.bottom} />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${gradientId})`} />
    </>
  );
}
