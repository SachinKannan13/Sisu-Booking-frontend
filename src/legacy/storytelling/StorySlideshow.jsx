import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import SlideCard from './SlideCard.jsx';
import { getGenreConfig } from '../../utils/genreConfig.js';

// Cinematic ease-out — fast start, gentle settle.
const CINEMATIC_EASE = [0.16, 1, 0.3, 1];

// Mood tint per story beat — cooler for tension, warmer for breakthrough/resolution.
function getSlideMoodColor(slideNumber, genreConfig) {
  switch (slideNumber) {
    case 3: return '#0a1420'; // darkest moment before insight — cool navy
    case 4: return '#2a1f0a'; // breakthrough — warm gold-amber
    case 5: return '#201f0f'; // resolution — warm, earned glow
    default: return genreConfig.bgColor || '#0d0d0d';
  }
}

export default function StorySlideshow({ story, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Prefer the AI-art-augmented slides (each slide gets a `scene_svg` field)
  // when present; fall back to the plain slides for older stories generated
  // before scene art existed.
  const slides = (story.slides_with_art && story.slides_with_art.length > 0)
    ? story.slides_with_art
    : (story.slides || []);
  const mapLocations = story.map_data?.story_locations || [];
  const total = slides.length;
  const config = getGenreConfig(story.genre || 'educational');

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrentSlide(prev => {
      const next = prev + dir;
      if (next < 0 || next >= total) return prev;
      return next;
    });
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, onClose]);

  if (!slides.length) return null;

  const slide = slides[currentSlide];
  const moodColor = getSlideMoodColor(slide.slide_number, config);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Full-bleed mood background, transitions smoothly between slides */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: `radial-gradient(ellipse at 30% 20%, ${moodColor} 0%, #050505 75%)`
        }}
        transition={{ duration: 0.6, ease: CINEMATIC_EASE }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] flex-shrink-0">
        <div>
          <h1 className="text-[#f5f0e8] font-semibold text-sm truncate max-w-xs">
            {story.story_title}
          </h1>
          <div className="flex items-center gap-1.5 text-[#5a4a3a] text-xs mt-0.5">
            <Clock size={11} />
            <span>{story.reading_time_estimate}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#9a8a78] text-sm">
            {currentSlide + 1} / {total}
          </span>
          <button
            onClick={onClose}
            className="text-[#9a8a78] hover:text-[#f5f0e8] transition-colors p-1.5 rounded-lg hover:bg-[#1a1a1a]"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <SlideCard
            key={currentSlide}
            slide={slide}
            direction={direction}
            genre={story.genre || 'educational'}
            mapLocations={mapLocations}
            isVisible={true}
          />
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative flex items-center justify-center gap-6 py-5 border-t border-[#1a1a1a] flex-shrink-0">
        <button
          onClick={() => go(-1)}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 text-sm text-[#9a8a78] hover:text-[#f5f0e8] disabled:opacity-20 disabled:cursor-not-allowed transition-all px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a]"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Progress dots — fill smoothly as the user advances */}
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
              className="h-2 rounded-full bg-[#333] overflow-hidden"
              animate={{ width: i === currentSlide ? 24 : 8 }}
              transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#f5a623' }}
                animate={{ width: i <= currentSlide ? '100%' : '0%' }}
                transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
              />
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={currentSlide === total - 1}
          className="flex items-center gap-1.5 text-sm text-[#9a8a78] hover:text-[#f5f0e8] disabled:opacity-20 disabled:cursor-not-allowed transition-all px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a]"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
