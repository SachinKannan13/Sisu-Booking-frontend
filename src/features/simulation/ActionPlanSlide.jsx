import { motion } from 'framer-motion';
import { CheckCircle, Clock, BookOpen, MapPin } from 'lucide-react';

export default function ActionPlanSlide({ content, mapLocations }) {
  // content could be a JSON string array or a narrative
  let steps = [];
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    if (Array.isArray(parsed)) steps = parsed;
  } catch (_) {
    // Fallback: treat content as plain text
    return (
      <div className="h-full overflow-y-auto pr-2">
        <p className="text-[#e8ddd0] text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  const colors = ['#f5a623', '#c85250', '#2d9b6f', '#7b5ea7'];

  return (
    <div className="h-full overflow-y-auto pr-2 flex flex-col gap-3">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#0d0d0d]/60 border border-[#2a2a2a] rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold text-[#0d0d0d]"
              style={{ backgroundColor: colors[i % colors.length] }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#f5f0e8] text-sm font-medium leading-snug">
                {step.action || step}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {step.timeline && (
                  <span className="flex items-center gap-1 text-xs text-[#9a8a78]">
                    <Clock size={10} />
                    {step.timeline}
                  </span>
                )}
                {step.book_reference && (
                  <span className="flex items-center gap-1 text-xs text-[#9a8a78]">
                    <BookOpen size={10} />
                    {step.book_reference}
                  </span>
                )}
                {step.chennai_context && (
                  <span className="flex items-center gap-1 text-xs text-[#f5a623]/70">
                    <MapPin size={10} />
                    {step.chennai_context}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
