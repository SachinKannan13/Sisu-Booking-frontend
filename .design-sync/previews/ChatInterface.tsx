import { ChatInterface } from 'booksphere-client';

// ChatInterface loads chat history via useChat hook (empty with stub Supabase).
// Shows the component layout with empty message history and input ready.

const mockBook = {
  id: 'preview-book',
  title: 'Atomic Habits',
  author: 'James Clear',
  genre: 'self-help',
  tone: 'Warm, practical, evidence-based',
  themes: ['habit formation', 'identity', 'systems'],
};

export const Default = () => (
  <div style={{ background: '#0d0d0d', height: '480px', display: 'flex', flexDirection: 'column', border: '1px solid #1a1a1a' }}>
    <ChatInterface book={mockBook} />
  </div>
);
