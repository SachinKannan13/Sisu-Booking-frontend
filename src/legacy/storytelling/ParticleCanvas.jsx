import { useEffect, useRef } from 'react';

const PARTICLE_CONFIGS = {
  dawn: {
    count: 20,
    color: 'rgba(245, 200, 100, VAL)',
    size: [1, 2.5],
    speed: [-0.3, -0.6],    // float upward
    drift: [-0.1, 0.1],
    opacity: [0.2, 0.5]
  },
  midday: {
    count: 12,
    color: 'rgba(255, 240, 200, VAL)',
    size: [0.8, 1.8],
    speed: [-0.1, -0.2],
    drift: [-0.2, 0.2],
    opacity: [0.1, 0.3]
  },
  goldenHour: {
    count: 28,
    color: 'rgba(245, 166, 35, VAL)',
    size: [1.2, 3],
    speed: [-0.2, -0.5],
    drift: [-0.15, 0.15],
    opacity: [0.3, 0.6]
  },
  night: {
    count: 40,
    color: 'rgba(200, 220, 255, VAL)',
    size: [0.5, 1.5],
    speed: [0, 0],
    drift: [-0.05, 0.05],
    opacity: [0.4, 0.9],
    twinkle: true
  },
  rain: {
    count: 45,
    color: 'rgba(160, 190, 220, VAL)',
    size: [0.5, 1],
    speed: [4, 7],           // falling down
    drift: [1.5, 2.5],       // diagonal
    opacity: [0.3, 0.6],
    rain: true
  }
};

function createParticle(canvas, config) {
  return {
    x: Math.random() * canvas.width,
    y: config.rain ? -20 : Math.random() * canvas.height,
    size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
    speed: config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]),
    drift: config.drift[0] + Math.random() * (config.drift[1] - config.drift[0]),
    opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.02 + Math.random() * 0.03
  };
}

export default function ParticleCanvas({ mood = 'midday', active = true }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const config = PARTICLE_CONFIGS[mood] || PARTICLE_CONFIGS.midday;

    // Size canvas to container
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    particlesRef.current = Array.from({ length: config.count }, () => createParticle(canvas, config));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        // Twinkle effect for night stars
        let op = p.opacity;
        if (config.twinkle) {
          p.twinklePhase += p.twinkleSpeed;
          op = p.opacity * (0.5 + 0.5 * Math.sin(p.twinklePhase));
        }

        ctx.globalAlpha = op;
        ctx.fillStyle = config.color.replace('VAL', op);

        if (config.rain) {
          // Rain streaks
          ctx.strokeStyle = config.color.replace('VAL', op);
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.drift * 0.8, p.y - p.size * 6);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Move particle
        p.y += p.speed;
        p.x += p.drift;

        // Reset when out of bounds
        if (config.rain) {
          if (p.y > canvas.height + 20 || p.x > canvas.width + 20) {
            Object.assign(p, createParticle(canvas, config));
          }
        } else {
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        }
      }

      ctx.globalAlpha = 1;
      if (active) rafRef.current = requestAnimationFrame(draw);
    }

    if (active) draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mood, active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
}
