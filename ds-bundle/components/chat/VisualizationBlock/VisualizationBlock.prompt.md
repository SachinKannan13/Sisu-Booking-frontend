VisualizationBlock from booksphere-client. Use via `window.Booksphere.VisualizationBlock` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### HabitLoop

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '520px' }}>
    <VizPanel type="diagram" title="The Habit Loop" code={habitLoopSvg} />
  </div>
)
```

### Timeline

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '520px' }}>
    <VizPanel type="timeline" title="Habit Formation Timeline" code={timelineSvg} />
  </div>
)
```
