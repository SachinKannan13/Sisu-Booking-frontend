# Booksphere (booksphere-client@1.0.0)

This design system is the published booksphere-client React library, bundled as a single
browser global. All 52 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.Booksphere`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.Booksphere.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { ActionPlanSlide } = window.Booksphere;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<ActionPlanSlide />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<BooksphereProvider>{children}</BooksphereProvider>
```

## Tokens

61 CSS custom properties from booksphere-client. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (8): `--tw-border-spacing-x`, `--tw-border-spacing-y`, `--tw-ring-offset-color`, …
- **spacing** (2): `--tw-ring-inset`, `--tw-space-y-reverse`
- **shadow** (4): `--tw-ring-offset-shadow`, `--tw-ring-shadow`, `--tw-shadow`, …
- **other** (47): `--tw-translate-x`, `--tw-translate-y`, `--tw-rotate`, …

## Components

### storytelling
- `ActionPlanSlide`
- `ChennaiMap`
- `InputWizard`
- `ParticleCanvas`
- `SlideCard`
- `StorySlideshow`

### scenes
- `AdyarTheosophical`
- `AnnaNagarTower`
- `BesantNagarSunset`
- `BoardroomPitch`
- `ChennaiCentralStation`
- `CoworkingSpace`
- `DriftingClouds`
- `ECRCoastalRoad`
- `FigureSilhouette`
- `FortStGeorge`
- `GenericHomeReflection`
- `GenericOffice`
- `IITMResearchPark`
- `KoyambeduMarket`
- `MahabalipuramShoreTemple`
- `MarinaBeach`
- `MetroTrainInterior`
- `MonsoonStreet`
- `MylaporeTemple`
- `NungambakkamCafe`
- `OMRTechPark`
- `ParticleLayer`
- `QuietWindowReflection`
- `RooftopNightView`
- `SceneRoot`
- `SkyBackground`
- `SunriseOverBay`
- `TNagarStreet`
- `ValluvarKottam`

### book
- `BookCard`
- `BookUpload`
- `ChapterNav`
- `ReadingMode`

### general
- `Button`
- `GenreBadge`
- `Modal`
- `ProcessingStatus`
- `SpinnerOverlay`
- `StoryLoadingScreen`

### chat
- `ChatInterface`
- `MessageBubble`
- `ReadingBlock`
- `VisualizationBlock`

### layout
- `Navbar`
- `Sidebar`

### profile
- `ProfileSetup`
