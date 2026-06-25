import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, Save, FlaskConical, Sparkles, Check, Building2 } from 'lucide-react';
import { MODE_COLORS } from '../../constants/learningModes.js';
import { completeSession } from '../../lib/api.js';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card.jsx';
import { Badge } from '@/components/ui/shadcn/badge.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/shadcn/accordion.jsx';
import { Button } from '@/components/ui/shadcn/button.jsx';
import toast from 'react-hot-toast';

// Renders text with **bold** markdown support, paragraph by paragraph
function Prose({ text }) {
  if (!text) return null;
  return (
    <div className="space-y-2.5">
      {text.split(/\n{2,}/).filter(Boolean).map((p, i) => (
        <p key={i} className="text-[#1c1c1c] text-sm leading-relaxed">
          {p.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-[#f5a623] font-semibold">{part.slice(2, -2)}</strong>
              : <span key={j}>{part}</span>
          )}
        </p>
      ))}
    </div>
  );
}

function EvidenceBlocks({ blocks, modeColor }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value="evidence" className="border border-[#eceae4] rounded-xl overflow-hidden">
        <AccordionTrigger className="px-4 py-2.5 bg-[#fbf9f3] text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] hover:bg-[#f3efe4] hover:no-underline [&>svg]:hidden">
          <span className="flex items-center gap-2">
            <Quote size={12} style={{ color: modeColor }} />
            {blocks.length} source passage{blocks.length !== 1 ? 's' : ''} retrieved
            <span className="ml-1 text-[#8f8a80] text-[10px] normal-case font-normal">(click to expand)</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="bg-[#fbf9f3] px-0 pb-0">
          <div className="px-4 py-3 space-y-3">
            {blocks.map((b, i) => (
              <div key={i} className="relative pl-3">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full" style={{ backgroundColor: modeColor, opacity: 0.5 }} />
                <p className="text-[#5f5f5d] text-sm italic leading-relaxed">&ldquo;{b.quote}&rdquo;</p>
                <Badge variant="outline" className="mt-1.5 text-[10px] text-[#8f8a80] border-[#eceae4]">{b.source}</Badge>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function FollowupChips({ questions, onPick }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-[10px] uppercase tracking-widest text-[#8f8a80] font-semibold mb-2">Explore further</p>
      <div className="flex flex-col gap-1.5">
        {questions.map((q, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPick(q)}
              className="w-full justify-start text-left text-xs text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#f3efe4] h-auto py-2 px-3 font-normal leading-relaxed"
            >
              <span className="mr-2 text-[#f5a623] shrink-0">→</span>
              {q}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function StructuredResponse({ mode, output, onAskFollowup, onSaveInsight, sessionId, onSessionComplete }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const color = MODE_COLORS[mode] || '#f5a623';

  if (!output) return null;

  const handleSave = async (content) => {
    if (!content) return;
    setSaving(true);
    try { await onSaveInsight(content); } finally { setSaving(false); }
  };

  const handleCompleteSession = async () => {
    if (!sessionId || completing || sessionDone) return;
    setCompleting(true);
    try {
      await completeSession(sessionId);
      setSessionDone(true);
      toast.success('Session completed — reflection saved to your memory');
      onSessionComplete && onSessionComplete();
    } catch (err) {
      toast.error(err.message || 'Failed to save session summary');
    } finally {
      setCompleting(false);
    }
  };

  const SaveButton = ({ content, label = 'Save as insight' }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleSave(content)}
      disabled={saving}
      className="flex items-center gap-1.5 text-xs text-[#5f5f5d] hover:text-[#f5a623] hover:border-[#f5a623]/40 h-8"
    >
      <Save size={12} /> {label}
    </Button>
  );

  const SendToLabButton = ({ draft, label = 'Send to Lab' }) => (
    <Button
      size="sm"
      onClick={() => navigate('/lab', { state: { draft, sessionId } })}
      className="flex items-center gap-1.5 text-xs bg-[#f5a623] hover:bg-[#e09520] text-[#1c1c1c] font-semibold h-8"
    >
      <FlaskConical size={12} /> {label}
    </Button>
  );

  // Three-layer cards used by multiple modes
  const ThreeLayerCards = ({ whatSaid, interpretation, synthesis, synthLabel }) => (
    <>
      {whatSaid && (
        <Card className="mb-3 border-l-4 border-l-[#4a6fa5] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[10px] uppercase tracking-widest text-[#4a6fa5] font-semibold">What the authors said</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3"><Prose text={whatSaid} /></CardContent>
        </Card>
      )}
      {interpretation && (
        <Card className="mb-3 border-l-4 border-l-[#f5a623] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[10px] uppercase tracking-widest text-[#a9690f] font-semibold">Interpretation</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3"><Prose text={interpretation} /></CardContent>
        </Card>
      )}
      {synthesis && (
        <Card className="mb-3 border-l-4 border-l-[#2d9b6f] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[10px] uppercase tracking-widest text-[#2d9b6f] font-semibold">
              {synthLabel || (mode === 'synthesizer' ? 'Synthesis' : mode === 'critic' ? 'Critique' : mode === 'builder' ? 'Build opportunity' : 'Analysis')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3"><Prose text={synthesis} /></CardContent>
        </Card>
      )}
    </>
  );

  const SaveInsightPrompt = ({ content }) => {
    if (!content) return null;
    return (
      <div className="mt-4 pt-3 border-t border-[#eceae4]">
        <div className="bg-gradient-to-r from-[#fef3dc] to-[#fbf9f3] rounded-xl p-3 border border-[#f5a623]/20">
          <p className="text-xs text-[#a9690f] font-medium mb-2 flex items-center gap-1.5">
            <Sparkles size={11} /> Suggested insight to save
          </p>
          <p className="text-sm text-[#1c1c1c] leading-relaxed mb-2">{content}</p>
          <Button
            size="sm"
            onClick={() => handleSave(content)}
            disabled={saving}
            className="bg-[#f5a623] hover:bg-[#e09520] text-[#1c1c1c] text-xs font-semibold h-7"
          >
            <Save size={11} className="mr-1" /> Save to memory
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <EvidenceBlocks blocks={output.evidence_blocks} modeColor={color} />

      {mode === 'scholar' && (
        <>
          <ThreeLayerCards
            whatSaid={output.what_authors_said}
            interpretation={output.interpretation}
            synthesis={output.interpretation ? null : null}
          />
          {output.key_terms?.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {output.key_terms.map((kt, i) => (
                <div key={i} className="bg-[#fbf9f3] rounded-lg p-3 border border-[#eceae4]">
                  <span className="text-[#f5a623] text-xs font-semibold">{kt.term}</span>
                  <p className="text-[#5f5f5d] text-xs mt-1">{kt.definition}</p>
                </div>
              ))}
            </div>
          )}
          {output.unstated_assumptions?.length > 0 && (
            <div className="mt-3">
              <p className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5">Unstated Assumptions</p>
              <ul className="space-y-1">
                {output.unstated_assumptions.map((a, i) => (
                  <li key={i} className="text-[#5f5f5d] text-sm flex gap-2"><span className="text-[#8f8a80] mt-0.5">—</span>{a}</li>
                ))}
              </ul>
            </div>
          )}
          <SaveInsightPrompt content={output.save_insight_prompt || output.interpretation || output.what_authors_said} />
        </>
      )}

      {mode === 'critic' && (
        <>
          {output.claims_examined?.length > 0 && (
            <div className="space-y-2 mb-4">
              {output.claims_examined.map((c, i) => (
                <div key={i} className="bg-[#fbf9f3] rounded-lg p-3 border border-[#eceae4]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1c1c1c] text-sm">{c.claim}</span>
                    <Badge variant="outline" className="text-[10px] uppercase shrink-0 ml-2" style={{
                      color: c.strength === 'strong' ? '#2d9b6f' : c.strength === 'weak' ? '#c85250' : '#f5a623',
                      borderColor: c.strength === 'strong' ? '#2d9b6f40' : c.strength === 'weak' ? '#c8525040' : '#f5a62340'
                    }}>{c.strength}</Badge>
                  </div>
                  {c.issue && <p className="text-[#5f5f5d] text-xs mt-1.5">{c.issue}</p>}
                </div>
              ))}
            </div>
          )}
          {output.assumptions?.length > 0 && (
            <div className="mb-3">
              <p className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5">Unstated Assumptions</p>
              <ul className="list-disc list-inside text-[#5f5f5d] text-sm space-y-1">
                {output.assumptions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          {output.counterarguments?.length > 0 && (
            <div className="mb-3">
              <p className="text-[#c85250] text-xs font-semibold uppercase tracking-wider mb-1.5">Counterarguments</p>
              <ul className="list-disc list-inside text-[#5f5f5d] text-sm space-y-1">
                {output.counterarguments.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          <Card className="mb-3 border-l-4 border-l-[#c85250] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-[10px] uppercase tracking-widest text-[#c85250] font-semibold">Verdict</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3"><Prose text={output.verdict} /></CardContent>
          </Card>
          <SaveInsightPrompt content={output.save_insight_prompt || output.verdict} />
        </>
      )}

      {mode === 'synthesizer' && (
        <>
          {output.sources_used?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {output.sources_used.map((s, i) => (
                <Badge key={i} variant="outline" className="text-[10px] text-[#8f8a80] border-[#eceae4]">{s}</Badge>
              ))}
            </div>
          )}
          {output.convergences?.length > 0 && (
            <Card className="mb-3 border-l-4 border-l-[#2d9b6f] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-[#2d9b6f] font-semibold">Convergences</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                {output.convergences.map((c, i) => (
                  <p key={i} className="text-[#1c1c1c] text-sm mb-1.5"><strong>{c.theme}:</strong> {c.description}</p>
                ))}
              </CardContent>
            </Card>
          )}
          {output.divergences?.length > 0 && (
            <Card className="mb-3 border-l-4 border-l-[#c85250] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-[#c85250] font-semibold">Divergences</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                {output.divergences.map((d, i) => (
                  <p key={i} className="text-[#1c1c1c] text-sm mb-1.5"><strong>{d.theme}:</strong> {d.description}</p>
                ))}
              </CardContent>
            </Card>
          )}
          <Card className="mb-3 border-l-4 border-l-[#f5a623] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-[10px] uppercase tracking-widest text-[#a9690f] font-semibold">Synthesis</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3"><Prose text={output.synthesis_insight} /></CardContent>
          </Card>
          {output.novel_combination && (
            <div className="mt-3 bg-[#fbf9f3] border border-[#f5a623]/30 rounded-xl p-4 flex gap-2">
              <Sparkles size={16} className="text-[#f5a623] flex-shrink-0 mt-0.5" />
              <Prose text={output.novel_combination} />
            </div>
          )}
          <SaveInsightPrompt content={output.save_insight_prompt || output.novel_combination || output.synthesis_insight} />
        </>
      )}

      {mode === 'practitioner' && (
        <>
          <Card className="mb-3 border-l-4 border-l-[#f5a623] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-[10px] uppercase tracking-widest text-[#a9690f] font-semibold">Core Principle</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3"><Prose text={output.core_principle} /></CardContent>
          </Card>
          {output.concrete_steps?.length > 0 && (
            <ol className="mt-3 space-y-2 list-decimal list-inside">
              {output.concrete_steps.map((s, i) => (
                <li key={i} className="text-[#1c1c1c] text-sm">
                  {s.step}
                  {s.why_it_works && <span className="text-[#5f5f5d] text-xs block mt-0.5 ml-1">{s.why_it_works}</span>}
                </li>
              ))}
            </ol>
          )}
          {output.common_pitfalls?.length > 0 && (
            <div className="mt-3">
              <p className="text-[#c85250] text-xs font-semibold uppercase tracking-wider mb-1.5">Common Pitfalls</p>
              <ul className="list-disc list-inside text-[#5f5f5d] text-sm space-y-1">
                {output.common_pitfalls.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {output.first_step_today && (
            <div className="mt-3 bg-gradient-to-r from-[#fef3dc] to-[#fbf9f3] border border-[#f5a623]/30 rounded-xl p-3">
              <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-wider mb-1">First step today</p>
              <p className="text-[#1c1c1c] text-sm">{output.first_step_today}</p>
            </div>
          )}
          <SaveInsightPrompt content={output.save_insight_prompt || output.first_step_today || output.core_principle} />
        </>
      )}

      {mode === 'teacher' && (
        <>
          <Prose text={output.response} />
          {output.step_label === 'Experiment' && output.experiment_draft && (
            <div className="mt-4 bg-[#fbf9f3] border border-[#2d6a8f]/30 rounded-xl p-4">
              <p className="text-[#2d6a8f] text-xs font-semibold uppercase tracking-wider mb-2">Experiment Ready</p>
              {output.experiment_draft.hypothesis && (
                <p className="text-[#1c1c1c] text-sm mb-3 italic">&ldquo;{output.experiment_draft.hypothesis}&rdquo;</p>
              )}
              <SendToLabButton
                draft={{
                  hypothesis: output.experiment_draft.hypothesis,
                  principle: output.response?.slice(0, 200),
                  variables: output.experiment_draft.variable ? [{ name: output.experiment_draft.variable, type: 'independent', description: '' }] : [],
                  success_measures: output.experiment_draft.success_measure ? [{ measure: output.experiment_draft.success_measure, how_to_observe: '' }] : [],
                  first_step_today: output.experiment_draft.first_step_today
                }}
                label="Send this experiment to Lab"
              />
            </div>
          )}
          {output.step_label === 'Reflect' && (
            <div className="mt-4 bg-[#fbf9f3] border border-[#7b5ea7]/30 rounded-xl p-4">
              <p className="text-[#7b5ea7] text-xs font-semibold uppercase tracking-wider mb-1.5">Session Complete</p>
              <p className="text-[#5f5f5d] text-sm mb-3">You&apos;ve completed all 10 steps. Save an AI-generated reflection to your learning memory.</p>
              {sessionDone ? (
                <div className="flex items-center gap-2 text-[#2d9b6f] text-sm">
                  <Check size={14} /> Reflection saved to your memory
                </div>
              ) : (
                <Button onClick={handleCompleteSession} disabled={completing}
                  className="bg-[#7b5ea7] hover:bg-[#6b4f97] text-white text-sm font-semibold h-9">
                  <Check size={14} className="mr-1.5" /> {completing ? 'Saving...' : 'Complete & Save Reflection'}
                </Button>
              )}
            </div>
          )}
          {output.save_insight_prompt && (
            <div className="mt-4"><SaveButton content={output.save_insight_prompt} label="Save this insight" /></div>
          )}
        </>
      )}

      {mode === 'experiment' && (
        <>
          <Prose text={output.principle} />
          {output.hypothesis && (
            <Card className="mt-3 border-l-4 border-l-[#2d6a8f] border-y-[#eceae4] border-r-[#eceae4] bg-[#fbf9f3]">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-[#2d6a8f] font-semibold">Hypothesis</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3"><p className="text-[#1c1c1c] text-sm">{output.hypothesis}</p></CardContent>
            </Card>
          )}
          {output.variables?.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {output.variables.map((v, i) => (
                <div key={i} className="bg-[#fbf9f3] rounded-lg p-2.5 border border-[#eceae4]">
                  <Badge variant="outline" className="text-[9px] uppercase mb-1.5" style={{
                    color: v.type === 'independent' ? '#4a6fa5' : v.type === 'dependent' ? '#2d9b6f' : '#7b5ea7',
                    borderColor: v.type === 'independent' ? '#4a6fa540' : v.type === 'dependent' ? '#2d9b6f40' : '#7b5ea740'
                  }}>{v.type}</Badge>
                  <p className="text-[#1c1c1c] text-xs font-medium">{v.name}</p>
                  {v.description && <p className="text-[#8f8a80] text-xs mt-0.5">{v.description}</p>}
                </div>
              ))}
            </div>
          )}
          {output.risks?.length > 0 && (
            <div className="mt-3">
              <p className="text-[#c85250] text-xs font-semibold uppercase tracking-wider mb-1.5">Risks</p>
              {output.risks.map((r, i) => (
                <p key={i} className="text-[#5f5f5d] text-sm mb-1">
                  <span className="font-medium">{r.risk}</span>
                  {r.mitigation && <span className="text-[#8f8a80]"> — {r.mitigation}</span>}
                </p>
              ))}
            </div>
          )}
          {output.predicted_outcome && (
            <div className="mt-3 bg-[#f3efe4] rounded-xl p-3 border border-[#eceae4]">
              <p className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1">Predicted Outcome</p>
              <p className="text-[#1c1c1c] text-sm">{output.predicted_outcome}</p>
            </div>
          )}
          {output.first_step_today && (
            <div className="mt-3 bg-gradient-to-r from-[#fef3dc] to-[#fbf9f3] border border-[#f5a623]/30 rounded-xl p-3">
              <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-wider mb-1">First step today</p>
              <p className="text-[#1c1c1c] text-sm">{output.first_step_today}</p>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <SendToLabButton draft={output} />
            <SaveButton content={output.save_insight_prompt || output.principle} />
          </div>
        </>
      )}

      {mode === 'builder' && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={14} className="text-[#a05c2e]" />
            <p className="text-[#a05c2e] text-xs font-semibold uppercase tracking-wider">Core Insight</p>
          </div>
          <Prose text={output.core_insight} />
          {output.opportunities?.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider">Opportunities</p>
              {output.opportunities.map((opp, i) => (
                <div key={i} className="bg-[#fbf9f3] border border-[#eceae4] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-[#1c1c1c] text-sm font-semibold">{opp.name}</h4>
                    <Badge variant="outline" className="text-[10px] text-[#8f8a80] border-[#eceae4] shrink-0">{opp.user}</Badge>
                  </div>
                  <p className="text-[#5f5f5d] text-sm mb-2">{opp.value_proposition}</p>
                  {opp.mechanism && <p className="text-[#8f8a80] text-xs">{opp.mechanism}</p>}
                  {opp.source_grounding && (
                    <p className="text-[#f5a623] text-xs mt-2 italic border-l-2 border-[#f5a623]/30 pl-2">{opp.source_grounding}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {output.market_hypothesis && (
            <div className="mt-4 bg-[#fbf9f3] rounded-xl p-3 border border-[#a05c2e]/20">
              <p className="text-[#a05c2e] text-xs font-semibold uppercase tracking-wider mb-1">Key Hypothesis to Test</p>
              <p className="text-[#1c1c1c] text-sm">{output.market_hypothesis}</p>
            </div>
          )}
          {output.seven_day_experiment && (
            <div className="mt-3 bg-gradient-to-r from-[#fef3dc] to-[#fbf9f3] border border-[#f5a623]/30 rounded-xl p-3">
              <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-wider mb-1">7-Day Experiment</p>
              <p className="text-[#1c1c1c] text-sm">{output.seven_day_experiment}</p>
            </div>
          )}
          {output.risks?.length > 0 && (
            <div className="mt-3">
              <p className="text-[#c85250] text-xs font-semibold uppercase tracking-wider mb-1.5">Watch For</p>
              <ul className="list-disc list-inside text-[#5f5f5d] text-sm space-y-1">
                {output.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            {output.seven_day_experiment && (
              <SendToLabButton draft={{ principle: output.core_insight, hypothesis: output.market_hypothesis, first_step_today: output.seven_day_experiment }} label="Send to Lab" />
            )}
            <SaveButton content={output.save_insight_prompt || output.core_insight} />
          </div>
        </>
      )}

      <FollowupChips questions={output.followup_questions} onPick={onAskFollowup} />
    </div>
  );
}
