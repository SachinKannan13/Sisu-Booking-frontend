import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { getChennaiAreas } from '../../lib/api.js';
import { useProfile } from '../../context/ProfileContext.jsx';

// user_profiles.stage uses a lowercase enum; this wizard's <select> uses the
// capitalized labels below — map one to the other when pre-filling from a
// saved profile. 'established' has no equivalent option here, so it's left
// blank rather than forced onto a mismatched choice.
const PROFILE_STAGE_TO_WIZARD_STAGE = {
  idea: 'Idea',
  mvp: 'MVP',
  growth: 'Growing',
  scale: 'Scaling'
};

const STEPS = [
  { title: 'Tell me about your business', subtitle: 'Let\'s set the scene for your story.' },
  { title: 'What\'s your current challenge?', subtitle: 'The obstacle is the plot.' },
  { title: 'What resonates from this book?', subtitle: 'Choose the lens for your story.' },
  { title: 'Let\'s make it specific', subtitle: 'The more detail, the more vivid your story.' },
  { title: 'Set the scene in Chennai', subtitle: 'Choose where your story unfolds.' }
];

function BotMessage({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-[#f5a623]/15 border border-[#f5a623]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm">📚</span>
      </div>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
        <p className="text-[#e8ddd0] text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

export default function InputWizard({ book, onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({ step1: {}, step2: {}, step3: {}, step4: {}, step5: {} });
  const [areaSearch, setAreaSearch] = useState('');
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const { profile } = useProfile();

  const stepKey = `step${step + 1}`;

  // Returning users shouldn't have to re-explain their business — pre-fill
  // step 1 (and a couple of other fields) from their saved profile, once,
  // on mount. Anything the user has already typed takes priority.
  useEffect(() => {
    if (profile && profile.business_name) {
      setInputs(prev => ({
        ...prev,
        step1: {
          businessName: profile.business_name || '',
          industry: profile.industry || '',
          stage: PROFILE_STAGE_TO_WIZARD_STAGE[profile.stage] || '',
          teamSize: profile.team_size || '',
          ...prev.step1
        },
        step2: {
          mainChallenge: profile.current_challenge || '',
          ...prev.step2
        },
        step5: {
          primaryArea: profile.preferred_chennai_area || '',
          ...prev.step5
        }
      }));
      if (profile.preferred_chennai_area) setAreaSearch(profile.preferred_chennai_area);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const setField = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [field]: value }
    }));
  };

  // Fetch Chennai area suggestions
  useEffect(() => {
    if (step === 4 && areaSearch.length > 1) {
      getChennaiAreas().then(({ data }) => {
        const all = data.areas || [];
        const filtered = all.filter(a =>
          a.name.toLowerCase().includes(areaSearch.toLowerCase())
        ).slice(0, 5);
        setAreaSuggestions(filtered);
      }).catch(() => {});
    } else {
      setAreaSuggestions([]);
    }
  }, [areaSearch, step]);

  const canAdvance = () => {
    const s = inputs[stepKey];
    if (step === 0) return s.businessName && s.industry && s.stage;
    if (step === 1) return s.mainChallenge;
    if (step === 2) return s.resonance;
    if (step === 3) return s.keyPeople && s.urgency && s.successVision;
    if (step === 4) return s.primaryArea && s.storyTone;
    return true;
  };

  const advance = () => {
    if (step < 4) setStep(s => s + 1);
    else onComplete(inputs);
  };

  const frameworks = book.key_frameworks?.slice(0, 3) || [];
  const themes = book.themes?.slice(0, 3) || [];
  const resonanceOptions = [
    ...frameworks.map(f => f.name),
    ...themes,
    'Something else'
  ].slice(0, 4);

  const botMessages = [
    `Great to meet you! Before we write your story inside "${book.title}", I need to understand your world. What's the business we're building this story around?`,
    `Got it. Now, every great story has a central conflict. What challenge is ${inputs.step1?.businessName || 'your startup'} facing right now?`,
    `Now let's connect your world to ${book.title}. Which of these themes speaks most to where you are?`,
    `Let's sharpen the story. Who are the key players, how soon does this need to resolve, and what does winning look like?`,
    `Almost there. Your story unfolds in Chennai. Where should we set the scene?`
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] flex-shrink-0">
        <div>
          <h2 className="text-[#f5f0e8] font-semibold">Create Your Story</h2>
          <p className="text-[#9a8a78] text-xs mt-0.5">Inside "{book.title}"</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Step dots */}
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= step ? '#f5a623' : '#2a2a2a',
                  transform: i === step ? 'scale(1.3)' : 'scale(1)'
                }}
              />
            ))}
          </div>
          <button onClick={onClose} className="text-[#9a8a78] hover:text-[#f5f0e8] transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs text-[#f5a623] font-semibold uppercase tracking-widest mb-1">
                Step {step + 1} of 5
              </p>
              <h3 className="text-2xl font-bold text-[#f5f0e8]">{STEPS[step].title}</h3>
              <p className="text-[#9a8a78] text-sm mt-1">{STEPS[step].subtitle}</p>
            </div>

            <BotMessage text={botMessages[step]} />

            {/* Step 1 */}
            {step === 0 && (
              <div className="flex flex-col gap-3">
                <input
                  className="wizard-input"
                  placeholder="Business name (e.g. Freshline)"
                  value={inputs.step1.businessName || ''}
                  onChange={e => setField('businessName', e.target.value)}
                />
                <input
                  className="wizard-input"
                  placeholder="Industry (e.g. B2B SaaS, HealthTech)"
                  value={inputs.step1.industry || ''}
                  onChange={e => setField('industry', e.target.value)}
                />
                <select
                  className="wizard-input"
                  value={inputs.step1.stage || ''}
                  onChange={e => setField('stage', e.target.value)}
                >
                  <option value="">Stage of business...</option>
                  <option value="Idea">Idea stage</option>
                  <option value="MVP">MVP</option>
                  <option value="Growing">Growing</option>
                  <option value="Scaling">Scaling</option>
                </select>
                <input
                  className="wizard-input"
                  type="number"
                  placeholder="Team size (optional)"
                  min={1}
                  value={inputs.step1.teamSize || ''}
                  onChange={e => setField('teamSize', e.target.value)}
                />
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <textarea
                  className="wizard-input min-h-[90px] resize-none"
                  placeholder="Describe your main challenge in 2-3 sentences..."
                  value={inputs.step2.mainChallenge || ''}
                  onChange={e => setField('mainChallenge', e.target.value)}
                />
                <input
                  className="wizard-input"
                  placeholder="What's the one fear behind this challenge? (optional)"
                  value={inputs.step2.keepingUpAtNight || ''}
                  onChange={e => setField('keepingUpAtNight', e.target.value)}
                />
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-2">
                  {resonanceOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setField('resonance', opt)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        inputs.step3.resonance === opt
                          ? 'border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623]'
                          : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#9a8a78] hover:border-[#444] hover:text-[#f5f0e8]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {inputs.step3.resonance === 'Something else' && (
                  <textarea
                    className="wizard-input min-h-[70px] resize-none"
                    placeholder="Tell us what resonates..."
                    value={inputs.step3.explanation || ''}
                    onChange={e => setField('explanation', e.target.value)}
                  />
                )}
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div className="flex flex-col gap-3">
                <input
                  className="wizard-input"
                  placeholder="Who else is part of this moment? e.g. co-founder, investor, a customer"
                  value={inputs.step4.keyPeople || ''}
                  onChange={e => setField('keyPeople', e.target.value)}
                />
                <select
                  className="wizard-input"
                  value={inputs.step4.urgency || ''}
                  onChange={e => setField('urgency', e.target.value)}
                >
                  <option value="">How soon does this need to resolve?</option>
                  <option value="This week">This week</option>
                  <option value="This month">This month</option>
                  <option value="This quarter">This quarter</option>
                  <option value="This year">This year</option>
                </select>
                <textarea
                  className="wizard-input min-h-[80px] resize-none"
                  placeholder="What does winning look like? Be specific..."
                  value={inputs.step4.successVision || ''}
                  onChange={e => setField('successVision', e.target.value)}
                />
              </div>
            )}

            {/* Step 5 */}
            {step === 4 && (
              <div className="flex flex-col gap-3 relative">
                <div className="relative">
                  <input
                    className="wizard-input"
                    placeholder="Primary area (e.g. Nungambakkam, Anna Nagar...)"
                    value={areaSearch}
                    onChange={e => {
                      setAreaSearch(e.target.value);
                      setField('primaryArea', e.target.value);
                    }}
                  />
                  {areaSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden z-10">
                      {areaSuggestions.map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            setAreaSearch(a.name);
                            setField('primaryArea', a.name);
                            setAreaSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#f5f0e8] hover:bg-[#2a2a2a] transition-colors"
                        >
                          {a.name}
                          <span className="text-[#9a8a78] text-xs ml-2">{a.area_type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  className="wizard-input"
                  placeholder="Any specific spot? e.g. your office, a café — leave blank and I'll choose one"
                  value={inputs.step5.specificVenue || ''}
                  onChange={e => setField('specificVenue', e.target.value)}
                />
                <select
                  className="wizard-input"
                  value={inputs.step5.storyTone || ''}
                  onChange={e => setField('storyTone', e.target.value)}
                >
                  <option value="">Story tone...</option>
                  <option value="Realistic">Realistic</option>
                  <option value="Aspirational">Aspirational</option>
                  <option value="Cinematic">Cinematic</option>
                </select>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-[#1a1a1a] flex-shrink-0">
        <button
          onClick={() => step > 0 && setStep(s => s - 1)}
          disabled={step === 0}
          className="text-[#9a8a78] text-sm hover:text-[#f5f0e8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <Button
          variant="primary"
          size="lg"
          onClick={advance}
          disabled={!canAdvance()}
        >
          {step === 4 ? 'Generate My Story' : 'Continue'}
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Wizard input styles */}
      <style>{`
        .wizard-input {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 12px 16px;
          color: #f5f0e8;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .wizard-input:focus {
          border-color: #444;
        }
        .wizard-input::placeholder {
          color: #5a4a3a;
        }
        .wizard-input option {
          background: #1a1a1a;
          color: #f5f0e8;
        }
      `}</style>
    </div>
  );
}
