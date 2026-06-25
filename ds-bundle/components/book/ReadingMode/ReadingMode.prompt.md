ReadingMode from booksphere-client. Use via `window.Booksphere.ReadingMode` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### Default

```jsx
() => (
  <div style={{ background: '#0d0d0d', height: '500px', display: 'flex' }}>
    <ReadingMode book={mockBook} />
  </div>
)
```
