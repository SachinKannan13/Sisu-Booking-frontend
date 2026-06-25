ProfileSetup from booksphere-client. Use via `window.Booksphere.ProfileSetup` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### NewProfile

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '32px', display: 'flex', justifyContent: 'center' }}>
    <ProfilePanel />
  </div>
)
```

### ExistingProfile

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '32px', display: 'flex', justifyContent: 'center' }}>
    <ProfilePanel profile={{
      business_name: 'Chennai Fintech Labs',
      industry: 'FinTech',
      stage: 'growth',
      team_size: '12',
      main_goal: 'Scale B2B payments to Tier-2 cities',
      current_challenge: 'Enterprise sales cycle and regulatory compliance'
    }} />
  </div>
)
```
