import { ReadingBlock } from 'booksphere-client';

const chapterData = JSON.stringify({
  chapter_title: 'Chapter 3: How to Build Better Habits in 4 Simple Steps',
  chunk_index: 8,
  page_estimate: 47,
});

export const WithChapterJump = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '480px' }}>
    <ReadingBlock data={chapterData} onJumpToPage={(idx) => console.log('jump', idx)} />
  </div>
);

export const WithoutJump = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '480px' }}>
    <ReadingBlock data={chapterData} />
  </div>
);

export const MultipleBlocks = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <ReadingBlock data={JSON.stringify({ chapter_title: 'Introduction', chunk_index: 0, page_estimate: 1 })} onJumpToPage={() => {}} />
    <ReadingBlock data={chapterData} onJumpToPage={() => {}} />
    <ReadingBlock data={JSON.stringify({ chapter_title: 'The 4th Law: Make It Satisfying', chunk_index: 22, page_estimate: 183 })} onJumpToPage={() => {}} />
  </div>
);
