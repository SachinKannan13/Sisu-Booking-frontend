import { ChapterNav } from 'booksphere-client';

const chapters = [
  { chapter: 'Introduction: The Surprising Power of Atomic Habits' },
  { chapter: '1. The Surprising Power of Atomic Habits' },
  { chapter: '2. How Your Habits Shape Your Identity' },
  { chapter: '3. How to Build Better Habits in 4 Simple Steps' },
  { chapter: '4. The Man Who Didn\'t Look Right' },
  { chapter: '5. The Best Way to Start a New Habit' },
];

export const WithChapters = () => (
  <div style={{ width: '220px', height: '400px', background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
    <ChapterNav chapters={chapters} currentPage={2} totalPages={chapters.length} />
  </div>
);

export const PageNavigation = () => (
  <div style={{ width: '220px', height: '400px', background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
    <ChapterNav chapters={[]} currentPage={7} totalPages={24} />
  </div>
);
