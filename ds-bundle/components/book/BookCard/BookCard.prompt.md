BookCard from booksphere-client. Use via `window.Booksphere.BookCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### ReadyState

```jsx
() => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px', background: '#0d0d0d', maxWidth: '520px' }}>
    <BookCardPanel book={{ id: '1', title: 'Atomic Habits', author: 'James Clear', genre: 'self-help', status: 'ready', word_count: 70000 }} />
    <BookCardPanel book={{ id: '3', title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'thriller', status: 'ready', word_count: 180000 }} />
  </div>
)
```

### Processing

```jsx
() => (
  <div style={{ padding: '24px', background: '#0d0d0d', maxWidth: '260px' }}>
    <BookCardPanel book={{ id: '2', title: 'Zero to One', author: 'Peter Thiel', genre: 'educational', status: 'processing' }} />
  </div>
)
```

### GenreVariants

```jsx
() => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px', background: '#0d0d0d', maxWidth: '520px' }}>
    <BookCardPanel book={{ id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'romance', status: 'ready', word_count: 120000 }} />
    <BookCardPanel book={{ id: '5', title: 'The Shining', author: 'Stephen King', genre: 'horror', status: 'ready', word_count: 150000 }} />
  </div>
)
```
