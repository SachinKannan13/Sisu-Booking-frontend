import { GenreBadge } from 'booksphere-client';

export const AllGenres = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '24px', background: '#0d0d0d' }}>
    <GenreBadge genre="thriller" />
    <GenreBadge genre="romance" />
    <GenreBadge genre="psychological" />
    <GenreBadge genre="comical" />
    <GenreBadge genre="self-help" />
    <GenreBadge genre="horror" />
    <GenreBadge genre="fantasy" />
    <GenreBadge genre="historical" />
    <GenreBadge genre="educational" />
    <GenreBadge genre="biography" />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '24px', background: '#0d0d0d' }}>
    <GenreBadge genre="thriller" size="xs" />
    <GenreBadge genre="thriller" size="sm" />
    <GenreBadge genre="thriller" size="md" />
  </div>
);
