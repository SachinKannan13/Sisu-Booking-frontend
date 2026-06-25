Sidebar from booksphere-client. Use via `window.Booksphere.Sidebar` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### Default

```jsx
() => (
  <div style={{ display: 'flex', height: '400px', background: '#0d0d0d' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '24px', color: '#9a8a78', fontSize: '14px' }}>
      Main content area
    </div>
  </div>
)
```
