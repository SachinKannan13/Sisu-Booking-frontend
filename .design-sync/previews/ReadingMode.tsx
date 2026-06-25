import { ReadingMode } from 'booksphere-client';

// ReadingMode fetches chapters via useBook hook (returns empty data with stub Supabase).
// Shows the component's chrome/layout in its empty state.

const mockBook = { id: 'preview-book', title: 'Atomic Habits', genre: 'self-help', author: 'James Clear' };

export const Default = () => (
  <div style={{ background: '#0d0d0d', height: '500px', display: 'flex' }}>
    <ReadingMode book={mockBook} />
  </div>
);
