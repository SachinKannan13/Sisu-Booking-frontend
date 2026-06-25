import { BookOpen, Swords, GitMerge, Hammer, GraduationCap, FlaskConical, Building2 } from 'lucide-react';

// Six learning modes — shared across LearnHub, LearningSession, StructuredResponse
export const LEARNING_MODES = [
  {
    id: 'scholar',
    label: 'Scholar',
    icon: BookOpen,
    color: '#4a6fa5',
    description: 'Deep, faithful exposition of what your sources actually say.'
  },
  {
    id: 'critic',
    label: 'Critic',
    icon: Swords,
    color: '#c85250',
    description: 'Stress-test claims, surface assumptions and counterarguments.'
  },
  {
    id: 'synthesizer',
    label: 'Synthesizer',
    icon: GitMerge,
    color: '#2d9b6f',
    description: 'Find convergence, divergence, and novel combinations across sources.'
  },
  {
    id: 'practitioner',
    label: 'Practitioner',
    icon: Hammer,
    color: '#f5a623',
    description: 'Translate ideas into concrete, actionable steps.'
  },
  {
    id: 'teacher',
    label: 'Teacher',
    icon: GraduationCap,
    color: '#7b5ea7',
    description: 'A guided 10-step Socratic loop to truly learn a concept.'
  },
  {
    id: 'experiment',
    label: 'Experiment',
    icon: FlaskConical,
    color: '#2d6a8f',
    description: 'Design a real-world experiment to test a principle yourself.'
  },
  {
    id: 'builder',
    label: 'Builder',
    icon: Building2,
    color: '#a05c2e',
    description: 'Translate principles into products, services, and business opportunities.'
  }
];

export const MODE_COLORS = LEARNING_MODES.reduce((acc, m) => {
  acc[m.id] = m.color;
  return acc;
}, {});

export const MODE_BY_ID = LEARNING_MODES.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {});

export const TEACHER_STEP_LABELS = [
  'Explain', 'Why It Matters', 'Examples', 'Diagnose', 'Assess',
  'Correct & Refine', 'Connect', 'Apply', 'Experiment', 'Reflect'
];

// Source type colors — used for chips in LearnHub source selector and Library badges
export const SOURCE_TYPE_COLORS = {
  book: '#f5a623',
  article: '#4a6fa5',
  essay: '#7b5ea7',
  paper: '#2d6a8f',
  transcript: '#2d9b6f',
  interview: '#d4547a',
  note: '#5f5f5d',
  url: '#c85250'
};

// Insight type colors — used in LearningMemory's Insights tab
export const INSIGHT_COLORS = {
  observation: '#4a6fa5',
  principle: '#f5a623',
  question: '#c85250',
  framework: '#7b5ea7',
  reflection: '#2d9b6f',
  experiment_result: '#2d6a8f'
};
