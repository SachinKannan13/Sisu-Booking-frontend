import { motion } from 'framer-motion';
import { getGenreConfig } from '../../utils/genreConfig.js';
import ActionPlanSlide from './ActionPlanSlide.jsx';
import ChennaiMap from './ChennaiMap.jsx';
import ParticleCanvas from './ParticleCanvas.jsx';
import { getSceneComponent } from './scenes/registry.js';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, scale: 0.98 })
};

// Cinematic ease-out — fast start, gentle settle.
const CINEMATIC_EASE = [0.16, 1, 0.3, 1];

export default function SlideCard({ slide, direction, genre, mapLocations = [], isVisible }) {
  const config = getGenreConfig(genre);
  const isActionPlan = slide.slide_number === 6;
  // getSceneComponent() always resolves to a valid component — falls back
  // to generic_reflection if the LLM picked a template id that doesn't exist.
  const SceneComponent = getSceneComponent(slide.scene_template);

  return (
    <motion.div
      key={slide.slide_number}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
      className="absolute inset-0 flex flex-col md:flex-row gap-0 overflow-hidden"
    >
      {/* Left: Text */}
      <div className="flex-1 flex flex-col justify-center px-10 py-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.4 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: config.color }}>
            Slide {slide.slide_number} of 6
          </p>
          <h2 className="text-3xl font-bold text-[#f5f0e8] mb-6 leading-tight" style={{ color: config.color }}>
            {slide.slide_title}
          </h2>

          {isActionPlan ? (
            <ActionPlanSlide content={slide.content} mapLocations={mapLocations} />
          ) : (
            <p className="slide-prose text-[#e8ddd0] text-base leading-[1.85]">
              {slide.content}
            </p>
          )}
        </motion.div>
      </div>

      {/* Right: Illustration or Map */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-6 bg-[#0a0a0a] relative overflow-hidden">
        {isActionPlan ? (
          <div className="w-full h-full min-h-[280px]">
            <ChennaiMap locations={mapLocations} />
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Atmospheric glow behind illustration */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 60%, ${config.color}30 0%, transparent 70%)` }}
              animate={{ opacity: [0.3, 0.65, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Scene illustration: AI SVG if available, else template component */}
            <motion.div
              key={`scene-${slide.slide_number}`}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8, ease: CINEMATIC_EASE }}
              style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
            >
              {slide.scene_image ? (
                // Real AI-generated illustration (Gemini image model, stored
                // in Supabase Storage server-side) — a genuine photo/concept-art
                // style image rather than text-model-drawn SVG markup.
                <img
                  src={slide.scene_image}
                  alt={slide.slide_title || 'Scene illustration'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', filter: `drop-shadow(0 0 24px ${config.color}35)` }}
                />
              ) : (
                // Fallback: existing hand-built template component
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: `drop-shadow(0 0 20px ${config.color}30)`, width: '100%', height: '100%' }}
                >
                  <SceneComponent
                    mood={slide.mood || 'midday'}
                    figurePose={slide.figure_pose || 'standing'}
                    accentColor={config.color}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Particle canvas overlay — always on top, mood-matched */}
            <ParticleCanvas mood={slide.mood || 'midday'} active={isVisible} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
