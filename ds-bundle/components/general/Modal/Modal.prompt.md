Modal from booksphere-client. Use via `window.Booksphere.Modal` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### DeleteConfirmation

```jsx
() => (
  <ModalPanel title="Confirm Delete" size="sm">
    <p style={{ color: '#9a8a78', marginBottom: '20px', fontSize: '14px', lineHeight: 1.6 }}>
      Are you sure you want to remove this book from your library? This action cannot be undone.
    </p>
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button variant="danger" size="sm">Delete Book</Button>
    </div>
  </ModalPanel>
)
```

### UploadBook

```jsx
() => (
  <ModalPanel title="Upload a Book" size="md">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: '#9a8a78', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
        Upload a PDF or EPUB file to generate your personalised story experience in Chennai.
      </p>
      <div style={{ border: '2px dashed #333', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#5a4a3a', fontSize: '14px' }}>
        Drop file here or click to browse
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="md">Cancel</Button>
        <Button variant="primary" size="md">Upload</Button>
      </div>
    </div>
  </ModalPanel>
)
```

### GenreSelection

```jsx
() => (
  <ModalPanel title="Select a Genre" size="md">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: '#9a8a78', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
        Choose the genre that best matches your book to personalise the storytelling experience.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['Thriller', 'Romance', 'Self-Help', 'Fantasy', 'Historical', 'Educational'].map(g => (
          <span key={g} style={{ padding: '8px 16px', background: '#242424', border: '1px solid #333', borderRadius: '8px', color: '#f5f0e8', fontSize: '13px', cursor: 'pointer' }}>{g}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="md">Cancel</Button>
        <Button variant="primary" size="md">Confirm</Button>
      </div>
    </div>
  </ModalPanel>
)
```
