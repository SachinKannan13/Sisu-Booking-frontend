BookUpload from booksphere-client. Use via `window.Booksphere.BookUpload` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### Default

```jsx
() => (
  <div style={{ padding: '24px', background: '#1a1a1a', maxWidth: '480px', borderRadius: '12px' }}>
    <BookUpload />
  </div>
)
```
