SpinnerOverlay from booksphere-client. Use via `window.Booksphere.SpinnerOverlay` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### Default

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px' }}>
    <SpinnerOverlay />
  </div>
)
```

### WithMessages

```jsx
() => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#0d0d0d', padding: '16px' }}>
    <SpinnerOverlay message="Loading chapters..." />
    <SpinnerOverlay message="Saving your progress..." />
    <SpinnerOverlay message="Generating your story..." />
  </div>
)
```
