ChapterNav from booksphere-client. Use via `window.Booksphere.ChapterNav` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### WithChapters

```jsx
() => (
  <div style={{ width: '220px', height: '400px', background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
    <ChapterNav chapters={chapters} currentPage={2} totalPages={chapters.length} />
  </div>
)
```

### PageNavigation

```jsx
() => (
  <div style={{ width: '220px', height: '400px', background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
    <ChapterNav chapters={[]} currentPage={7} totalPages={24} />
  </div>
)
```
