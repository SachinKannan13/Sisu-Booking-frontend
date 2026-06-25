# Booksphere Design System — Conventions

## Colour tokens

All colours are defined as Tailwind CSS custom theme values. Use the token names in className props rather than bare hex values.

| Token | Hex | Use |
|---|---|---|
| `surface` / `bg-surface` | `#0d0d0d` | Page / app background |
| `surface-card` / `bg-surface-card` | `#1a1a1a` | Card, sidebar, panel backgrounds |
| `surface-elevated` / `bg-surface-elevated` | `#252525` | Modals, tooltips, dropdowns |
| `accent` / `text-accent` | `#f5a623` | Amber — primary interactive, icons, highlights |
| `accent-muted` | `#c4801a` | Hover state for amber elements |
| `ink` / `text-ink` | `#f5f0e8` | Primary readable text (warm white) |
| `ink-secondary` / `text-ink-secondary` | `#9a8a78` | Secondary/helper text |
| `ink-muted` / `text-ink-muted` | `#5a4a3a` | Timestamps, tertiary labels |
| Border subtle | `#2a2a2a` | Default card/component borders |
| Border hover | `#444` | Hover or focus border state |

**Genre colours** are accessed via `getGenreConfig(genre)` from `src/utils/genreConfig.js`. Each returns `{ color, bgColor, label, icon, voice }`. The `color` is used for cover gradients, badge dots, and GenreBadge borders.

## Typography

- Font: **Inter** (loaded from Google Fonts)
- Use Tailwind size classes: `text-xs` (10–12px), `text-sm` (13–14px), `text-base` (16px)
- Headings: `font-semibold text-[#f5f0e8]`
- Body: `text-[#e8ddd0]` or `text-[#f5f0e8]`
- Helper/secondary: `text-[#9a8a78]`
- Muted: `text-[#5a4a3a]`

## Border radius

- Buttons: `rounded-xl` (large)
- Cards: `rounded-xl`
- Modals / profile cards: `rounded-2xl`
- Small chips / badges: `rounded-full`
- Inputs: `rounded-lg`

## Motion

All interactive components use **framer-motion**. Standard pattern:
```jsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
>
```
The easing `[0.16, 1, 0.3, 1]` is Booksphere's "cinematic ease-out" used throughout for slide/card mounts.

> **Note for design previews**: Components with `initial={{ opacity: 0 }}` render blank in headless Playwright captures. Affected components (BookCard, MessageBubble, Modal, VisualizationBlock, ProfileSetup, StoryLoadingScreen) use static panel helpers in their `.design-sync/previews/*.tsx` files that recreate the layout without the motion wrapper.

## Provider requirement

All components that use React Router (`useNavigate`, `Link`, `NavLink`) or auth context (`useApp`, `useProfile`) require the `BooksphereProvider` wrapper:

```jsx
// BooksphereProvider wraps MemoryRouter + AppProvider + ProfileProvider
import { BooksphereProvider } from 'booksphere-client';
<BooksphereProvider>
  <YourComponent />
</BooksphereProvider>
```

The design-sync config sets `provider.component: "BooksphereProvider"` so all previews are automatically wrapped.

## Supabase / auth context

With no Supabase environment variables, the client is a no-op stub that returns empty data. Components render in their empty/unauthenticated state. This is expected in design previews — `useApp()` returns `{ user: null, books: [] }`, and `useProfile()` returns `{ profile: null }`.

## Scenes group

The `scenes/` group (22 SVG scene components) are animated SVG landscapes used in the storytelling flow. They have no props (self-contained) and use CSS keyframe animations. Helper primitives (`SceneRoot`, `SkyBackground`, `FigureSilhouette`, `DriftingClouds`, `ParticleLayer`) are composable building blocks and show floor cards in the picker (no authored preview needed).

## Component groups

| Group | Components |
|---|---|
| `ui` | Button, Modal, GenreBadge, ProcessingStatus, StoryLoadingScreen, SpinnerOverlay |
| `layout` | Sidebar, Navbar |
| `book` | BookCard, BookUpload, ChapterNav, ReadingMode |
| `chat` | ChatInterface, MessageBubble, ReadingBlock, VisualizationBlock |
| `profile` | ProfileSetup |
| `storytelling` | ChennaiMap, ActionPlanSlide, StorySlideshow, InputWizard, SlideCard, ParticleCanvas |
| `scenes` | 22 animated SVG scene components |
