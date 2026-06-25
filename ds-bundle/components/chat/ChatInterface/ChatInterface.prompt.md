ChatInterface from booksphere-client. Use via `window.Booksphere.ChatInterface` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### Default

```jsx
() => (
  <div style={{ background: '#0d0d0d', height: '480px', display: 'flex', flexDirection: 'column', border: '1px solid #1a1a1a' }}>
    <ChatInterface book={mockBook} />
  </div>
)
```
