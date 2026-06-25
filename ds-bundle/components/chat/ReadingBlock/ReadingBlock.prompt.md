ReadingBlock from booksphere-client. Use via `window.Booksphere.ReadingBlock` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### WithChapterJump

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '480px' }}>
    <ReadingBlock data={chapterData} onJumpToPage={(idx) => console.log('jump', idx)} />
  </div>
)
```

### WithoutJump

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '480px' }}>
    <ReadingBlock data={chapterData} />
  </div>
)
```

### MultipleBlocks

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <ReadingBlock data={JSON.stringify({ chapter_title: 'Introduction', chunk_index: 0, page_estimate: 1 })} onJumpToPage={() => {}} />
    <ReadingBlock data={chapterData} onJumpToPage={() => {}} />
    <ReadingBlock data={JSON.stringify({ chapter_title: 'The 4th Law: Make It Satisfying', chunk_index: 22, page_estimate: 183 })} onJumpToPage={() => {}} />
  </div>
)
```
