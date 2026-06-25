# Booksphere Design Sync — Build Notes

## First sync completed 2026-06-22

- 52 components exported across 7 groups: book, chat, general, layout, profile, scenes, storytelling
- 17 components have authored preview cards (core UI + chat + layout groups)
- 35 components use auto-generated floor cards (scenes helpers and storytelling complex components)

---

## Re-sync command

```sh
node .ds-sync/package-build.mjs \
  --config .design-sync/config.json \
  --node-modules ./node_modules \
  --out ./ds-bundle \
  --entry ./src/ds-entry.js \
  --conventions .design-sync/conventions.md
```

The `--entry ./src/ds-entry.js` flag is required because this is a pure-JS app (no `dist/` or `.d.ts` files) and `src/ds-entry.js` is the synthetic barrel entry.

---

## Known render warns

- **SceneRoot** — `[RENDER_BLANK]` reported by package-validate. This is expected: `SceneRoot` is a wrapper component that renders a blank SVG container without children. It ships as a floor card (API documented in `.prompt.md`).

---

## framer-motion initial opacity:0 issue

Several components use `motion.div` with `initial={{ opacity: 0 }}`, which renders blank in headless Playwright captures. Affected components use static panel helpers in their preview files rather than the actual animated component:

| Component | Preview approach |
|---|---|
| BookCard | `BookCardPanel` (static layout with inline GENRE_COLORS map) |
| MessageBubble | `MsgBubble` (static layout with inline SVG icons) |
| Modal | `ModalPanel` (static layout) |
| VisualizationBlock | `VizPanel` (static layout, SVG inline via dangerouslySetInnerHTML) |
| ProfileSetup | `ProfilePanel` (static form layout using Button component) |
| StoryLoadingScreen | `LoadingScreenPreview` (static layout with progress dots) |

---

## Supabase stub

`src/lib/supabase.js` was modified to add a no-op stub when `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are absent (esbuild context has no VITE env vars). The stub is safe for production — it only activates when both env vars are missing. If the original single-line `createClient` call is ever restored, the IIFE bundle will crash during design-sync builds.

---

## Provider

All components requiring router or auth context are wrapped by `BooksphereProvider` (configured via `cfg.provider`). Source: `src/ds-provider.jsx` — wraps `MemoryRouter + AppProvider + ProfileProvider`.

---

## Tailwind CSS

`tailwind-compiled.css` at repo root is the pre-compiled Tailwind output. It must be regenerated after any Tailwind config or `@layer` changes:

```sh
npx tailwindcss -i ./src/index.css -o ./tailwind-compiled.css --minify
```

Then re-run the build command above. The `cssEntry` in config points to this file.

---

## BooksphereProvider import path

`src/ds-provider.jsx` exports `BooksphereProvider`. `src/ds-entry.js` re-exports it. If `AppContext.jsx` or `ProfileContext.jsx` are moved or renamed, update both files.
