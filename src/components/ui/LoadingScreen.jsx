import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const STORY_MESSAGES = [
  'Placing you inside the story...',
  'Mapping your journey through Chennai...',
  'Weaving the book\'s wisdom into your world...',
  'Crafting your breakthrough moment...',
  'Painting your story scenes...',
  'Almost there — finalizing your action plan...'
];

export function StoryLoadingScreen({ bookTitle }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx(i => (i + 1) % STORY_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#f7f4ed] flex flex-col items-center justify-center">
      {/* Shimmer background */}
      <div className="absolute inset-0 shimmer opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center gap-8 px-8 text-center max-w-lg"
      >
        {/* Animated book icon */}
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-20 h-20 bg-[#f5a623]/10 rounded-2xl flex items-center justify-center border border-[#f5a623]/20"
        >
          <BookOpen size={40} className="text-[#f5a623]" />
        </motion.div>

        {bookTitle && (
          <p className="text-[#5f5f5d] text-sm uppercase tracking-widest">
            {bookTitle}
          </p>
        )}

        <h2 className="text-2xl font-semibold text-[#1c1c1c]">
          Generating Your Story
        </h2>

        {/* Cycling messages */}
        <div className="h-8 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-[#f5a623] text-base"
            >
              {STORY_MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {STORY_MESSAGES.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#f5a623]"
              animate={{ opacity: msgIdx === i ? 1 : 0.25, scale: msgIdx === i ? 1.3 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <p className="text-[#8f8a80] text-sm">
          This takes 60–120 seconds — Chennai, and the art for each scene, are being built around you...
        </p>
      </motion.div>
    </div>
  );
}

export function SpinnerOverlay({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-10 h-10 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
      <p className="text-[#5f5f5d] text-sm">{message}</p>
    </div>
  );
}
