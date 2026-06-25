import { GenreBadge, ProcessingStatus } from 'booksphere-client';

// BookCard uses motion.div with initial={{ opacity: 0, y: 16 }} — blank in headless capture.
// Recreate the card structure statically with the same layout.
const GENRE_COLORS: Record<string, string> = {
  'self-help': '#f5a623',
  'educational': '#2d9b6f',
  'thriller': '#c0392b',
  'romance': '#e91e8c',
  'horror': '#7b2d2d',
  'fiction': '#4a90d9',
  'biography': '#7b5ea7',
  'business': '#2980b9',
  'science': '#16a085',
  'history': '#8e6b3e',
};

const BookCardPanel = ({ book }: any) => {
  const coverColor = book.cover_color || GENRE_COLORS[book.genre] || '#1a3a5c';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a2a', background: '#1a1a1a', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
      <div style={{ height: '176px', display: 'flex', alignItems: 'flex-end', padding: '16px', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${coverColor}cc 0%, ${coverColor}55 100%)` }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '96px', height: '96px', borderRadius: '50%', backgroundColor: coverColor, opacity: 0.2 }} />
        <div style={{ position: 'absolute', top: '-16px', left: '-16px', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: coverColor, opacity: 0.1 }} />
        {book.status !== 'ready' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(245,166,35,0.3)', borderTopColor: '#f5a623' }} />
          </div>
        )}
        <GenreBadge genre={book.genre} />
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <h3 style={{ fontWeight: 600, color: '#f5f0e8', fontSize: '14px', lineHeight: 1.4, margin: 0 }}>{book.title}</h3>
        <p style={{ color: '#9a8a78', fontSize: '12px', margin: 0 }}>{book.author || 'Unknown Author'}</p>
        <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ProcessingStatus status={book.status} />
          {book.status === 'ready' && book.word_count > 0 && (
            <span style={{ color: '#5a4a3a', fontSize: '12px' }}>{Math.round(book.word_count / 250)} pages</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ReadyState = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px', background: '#0d0d0d', maxWidth: '520px' }}>
    <BookCardPanel book={{ id: '1', title: 'Atomic Habits', author: 'James Clear', genre: 'self-help', status: 'ready', word_count: 70000 }} />
    <BookCardPanel book={{ id: '3', title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'thriller', status: 'ready', word_count: 180000 }} />
  </div>
);

export const Processing = () => (
  <div style={{ padding: '24px', background: '#0d0d0d', maxWidth: '260px' }}>
    <BookCardPanel book={{ id: '2', title: 'Zero to One', author: 'Peter Thiel', genre: 'educational', status: 'processing' }} />
  </div>
);

export const GenreVariants = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px', background: '#0d0d0d', maxWidth: '520px' }}>
    <BookCardPanel book={{ id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'romance', status: 'ready', word_count: 120000 }} />
    <BookCardPanel book={{ id: '5', title: 'The Shining', author: 'Stephen King', genre: 'horror', status: 'ready', word_count: 150000 }} />
  </div>
);
