GenreBadge from booksphere-client. Use via `window.Booksphere.GenreBadge` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### AllGenres

```jsx
() => (
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
)
```

### Sizes

```jsx
() => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '24px', background: '#0d0d0d' }}>
    <GenreBadge genre="thriller" size="xs" />
    <GenreBadge genre="thriller" size="sm" />
    <GenreBadge genre="thriller" size="md" />
  </div>
)
```
