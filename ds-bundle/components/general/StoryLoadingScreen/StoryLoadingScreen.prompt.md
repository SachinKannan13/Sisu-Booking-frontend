StoryLoadingScreen from booksphere-client. Use via `window.Booksphere.StoryLoadingScreen` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### AtomicHabits

```jsx
() => (
  <div style={{ background: '#0d0d0d', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <LoadingScreenPreview bookTitle="Atomic Habits" />
  </div>
)
```

### SpinnerVariants

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <SpinnerOverlay message="Loading chapters..." />
    <SpinnerOverlay message="Saving your progress..." />
  </div>
)
```
