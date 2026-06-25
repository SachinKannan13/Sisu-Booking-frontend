// bgColor is a light tint (~10% alpha) of `color`, meant to sit on the
// cream page background (#f7f4ed) as a subtle pill fill — was a dark
// tinted background under the old dark theme, flipped here for the
// warm-cream system instead of needing a parallel dark/light table.
export const genreConfig = {
  thriller: {
    color: '#c85250',
    bgColor: '#c852501a',
    label: 'Thriller',
    icon: 'Zap',
    voice: 'Tense & Revealing'
  },
  romance: {
    color: '#d4547a',
    bgColor: '#d4547a1a',
    label: 'Romance',
    icon: 'Heart',
    voice: 'Warm & Empathetic'
  },
  psychological: {
    color: '#7b5ea7',
    bgColor: '#7b5ea71a',
    label: 'Psychological',
    icon: 'Brain',
    voice: 'Deep & Nuanced'
  },
  comical: {
    color: '#f5a623',
    bgColor: '#f5a6231a',
    label: 'Comical',
    icon: 'Smile',
    voice: 'Witty & Sharp'
  },
  'self-help': {
    color: '#2d9b6f',
    bgColor: '#2d9b6f1a',
    label: 'Self-Help',
    icon: 'TrendingUp',
    voice: 'Direct & Practical'
  },
  horror: {
    color: '#b54a56',
    bgColor: '#b54a561a',
    label: 'Horror',
    icon: 'AlertTriangle',
    voice: 'Atmospheric & Urgent'
  },
  fantasy: {
    color: '#4a6fa5',
    bgColor: '#4a6fa51a',
    label: 'Fantasy',
    icon: 'Sparkles',
    voice: 'Immersive & Epic'
  },
  historical: {
    color: '#8b6914',
    bgColor: '#8b69141a',
    label: 'Historical',
    icon: 'BookOpen',
    voice: 'Grounded & Precise'
  },
  educational: {
    color: '#2d6a8f',
    bgColor: '#2d6a8f1a',
    label: 'Educational',
    icon: 'GraduationCap',
    voice: 'Clear & Progressive'
  },
  biography: {
    color: '#5a7a4a',
    bgColor: '#5a7a4a1a',
    label: 'Biography',
    icon: 'User',
    voice: 'Personal & Narrative'
  }
};

export function getGenreConfig(genre) {
  return genreConfig[genre] || {
    color: '#5f5f5d',
    bgColor: '#eceae4',
    label: genre || 'Unknown',
    icon: 'Book',
    voice: 'Thoughtful'
  };
}
