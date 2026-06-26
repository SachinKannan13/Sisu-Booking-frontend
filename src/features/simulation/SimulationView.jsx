/**
 * SimulationView — full-screen overlay that presents a simulation result.
 *
 * Structure:
 *  ┌──────────────────────────────────────────┐
 *  │  Header: premise, lens badge, close      │
 *  │──────────────────────────────────────────│
 *  │  "Watch Simulation" CTA                  │  ← opens StorySlideshow (beats)
 *  │──────────────────────────────────────────│
 *  │  Proof panel (collapsible)               │
 *  │  7-day Experiment card                   │
 *  │  [Send to Experience Lab]                │
 *  └──────────────────────────────────────────┘
 *
 * Props:
 *   simulation  — the SimulationResult object from POST /api/simulate
 *   onClose     — () => void
 *   onSendToLab — (experiment: string) => void  (optional)
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, ChevronDown, ChevronUp, FlaskConical,
  MapPin, Lightbulb, BookOpen, AlertTriangle, ArrowRight
} from 'lucide-react';
import StorySlideshow from './StorySlideshow.jsx';

// ── Lens badge colours ─────────────────────────────────────────
const LENS_COLOURS = {
  life:          { bg: '#e8f4f0', text: '#1a6b50', border: '#a8d5c5' },
  relationships: { bg: '#f0e8f4', text: '#6b1a6b', border: '#d5a8d5' },
  habits:        { bg: '#f4f0e8', text: '#6b5a1a', border: '#d5c5a8' },
  career:        { bg: '#e8eef4', text: '#1a3b6b', border: '#a8bdd5' },
  creativity:    { bg: '#f4e8e8', text: '#6b1a1a', border: '#d5a8a8' },
  community:     { bg: '#e8f4e8', text: '#1a6b1a', border: '#a8d5a8' },
  business:      { bg: '#fef3e2', text: '#92400e', border: '#fcd34d' },
};

// ── Adapt our beats → SlideCard's expected slide shape ────────
function beatsToSlides(beats = []) {
  return beats.map((beat, i) => ({
    slide_number:   i + 1,
    slide_title:    beat.title,
    // SlideCard shows `content` as the prose body.  We join the narrative
    // with "what changes" so each slide tells a complete micro-story.
    content: [beat.narrative, beat.what_changes ? `↳ ${beat.what_changes}` : '']
                .filter(Boolean).join('\n\n'),
    scene_template: beat.scene_key,
    mood:           beat.mood || 'day',
    figure_pose:    'standing',
    evidence:       beat.evidence,
  }));
}

// ── Reusable section card ──────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#fafaf7] border border-[#eceae4] rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// ── Evidence block inside the proof panel ─────────────────────
function EvidenceBlock({ block }) {
  return (
    <blockquote className="border-l-2 border-[#f5a623]/50 pl-3 py-0.5 my-2">
      <p className="text-[#3a3a35] text-sm italic leading-relaxed">"{block.quote}"</p>
      <cite className="text-[#8f8a80] text-xs not-italic mt-1 block">{block.source}</cite>
    </blockquote>
  );
}

// ── Proof panel ───────────────────────────────────────────────
function ProofPanel({ proof }) {
  const [open, setOpen] = useState(false);
  if (!proof) return null;

  return (
    <Card>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-[#f5a623]" />
          <span className="text-[#1c1c1c] font-semibold text-sm">Why this works — proof</span>
        </div>
        {open ? <ChevronUp size={15} className="text-[#8f8a80]" /> : <ChevronDown size={15} className="text-[#8f8a80]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">

              {/* Mechanism */}
              {proof.mechanism && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80] mb-1">Mechanism</p>
                  <p className="text-[#3a3a35] text-sm leading-relaxed">{proof.mechanism}</p>
                </div>
              )}

              {/* Leading indicators */}
              {proof.leading_indicators?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80] mb-1">Early signals it's working</p>
                  <ul className="space-y-1">
                    {proof.leading_indicators.map((sig, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#3a3a35]">
                        <span className="text-[#f5a623] mt-0.5 flex-shrink-0">▸</span>
                        {sig}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence quotes */}
              {proof.evidence_blocks?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80] mb-1">From the canon</p>
                  {proof.evidence_blocks.map((b, i) => <EvidenceBlock key={i} block={b} />)}
                </div>
              )}

              {/* Assumptions */}
              {proof.assumptions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80] mb-1">Assumptions</p>
                  <ul className="space-y-1">
                    {proof.assumptions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#5f5f5d]">
                        <AlertTriangle size={12} className="text-[#f5a623]/70 mt-0.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Falsification test */}
              {proof.how_to_falsify && (
                <div className="bg-[#fff8ee] border border-[#f5a623]/20 rounded-xl p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80] mb-1">How to test if this is wrong</p>
                  <p className="text-[#3a3a35] text-sm">{proof.how_to_falsify}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────
export default function SimulationView({ simulation, onClose, onSendToLab }) {
  const [showSlideshow, setShowSlideshow] = useState(false);
  const slides     = beatsToSlides(simulation?.beats || []);
  const lensKey    = simulation?.lens || 'life';
  const lensColour = LENS_COLOURS[lensKey] || LENS_COLOURS.life;

  // Shape the story object to what StorySlideshow expects
  const storyForSlideshow = {
    story_title:         simulation?.premise || 'Simulation',
    reading_time_estimate: `${slides.length} beats`,
    genre:               'educational',
    slides,
  };

  return (
    <>
      {/* ── Full-screen backdrop ── */}
      <motion.div
        className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#f8f7f2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#eceae4] bg-white/80 backdrop-blur-sm px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                style={{ color: lensColour.text, backgroundColor: lensColour.bg, borderColor: lensColour.border }}
              >
                {lensKey.charAt(0).toUpperCase() + lensKey.slice(1)} lens
              </span>
              {simulation?.setting?.place && (
                <span className="flex items-center gap-1 text-xs text-[#8f8a80]">
                  <MapPin size={11} />
                  {simulation.setting.place}
                </span>
              )}
            </div>
            <p className="text-[#1c1c1c] font-semibold text-base leading-snug line-clamp-2">
              {simulation?.premise}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-[#8f8a80] hover:text-[#1c1c1c] transition-colors p-1.5 rounded-lg hover:bg-[#eceae4] mt-0.5"
            aria-label="Close simulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

            {/* ── Watch CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <button
                onClick={() => setShowSlideshow(true)}
                disabled={slides.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-[#1c1c1c] text-white rounded-2xl py-4 font-semibold text-sm hover:bg-[#2d2d2d] active:scale-[0.98] transition-all disabled:opacity-40"
              >
                <Play size={16} fill="currentColor" />
                Watch Simulation ({slides.length} beats)
              </button>
            </motion.div>

            {/* ── Beats list (condensed preview) ── */}
            {slides.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={15} className="text-[#8f8a80]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80]">Story arc</span>
                  </div>
                  <ol className="space-y-2">
                    {slides.map((slide, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                          style={{ backgroundColor: `${lensColour.border}60`, color: lensColour.text }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1c1c1c] text-sm font-medium leading-snug">{slide.slide_title}</p>
                          {simulation.beats[i]?.what_changes && (
                            <p className="text-[#8f8a80] text-xs mt-0.5 leading-snug">{simulation.beats[i].what_changes}</p>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-[10px] text-[#b8b3a8] capitalize mt-1">{slide.mood}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </motion.div>
            )}

            {/* ── Predicted outcome ── */}
            {simulation?.predicted_outcome && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="bg-[#fffbf3] border-[#f5a623]/25">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80] mb-1">Predicted outcome</p>
                  <p className="text-[#3a3a35] text-sm leading-relaxed">{simulation.predicted_outcome}</p>
                </Card>
              </motion.div>
            )}

            {/* ── Proof panel ── */}
            {simulation?.proof && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ProofPanel proof={simulation.proof} />
              </motion.div>
            )}

            {/* ── 7-day experiment card ── */}
            {simulation?.seven_day_experiment && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="border-2 border-dashed border-[#f5a623]/40 bg-[#fffdf7]">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical size={15} className="text-[#f5a623]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8f8a80]">7-day experiment</span>
                  </div>
                  <p className="text-[#1c1c1c] text-sm leading-relaxed mb-4">{simulation.seven_day_experiment}</p>
                  {onSendToLab && (
                    <button
                      onClick={() => onSendToLab(simulation.seven_day_experiment)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#f5a623] hover:text-[#d4891c] transition-colors group"
                    >
                      Send to Experience Lab
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </Card>
              </motion.div>
            )}

            {/* ── Save insight prompt ── */}
            {simulation?.save_insight_prompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-center text-xs text-[#8f8a80] italic px-4">{simulation.save_insight_prompt}</p>
              </motion.div>
            )}

            {/* Bottom padding */}
            <div className="h-8" />
          </div>
        </div>
      </motion.div>

      {/* ── Cinematic slideshow — mounts above the view (z-50) ── */}
      <AnimatePresence>
        {showSlideshow && (
          <StorySlideshow
            story={storyForSlideshow}
            onClose={() => setShowSlideshow(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
