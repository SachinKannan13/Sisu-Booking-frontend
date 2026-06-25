ParticleLayer from booksphere-client. Use via `window.Booksphere.ParticleLayer` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

A lightweight top-layer of small animated dots/streaks for extra
atmospheric depth — dust motes, light particles, or fine rain mist.
Pure SVG + CSS, no canvas/WebGL, consistent with the rest of the system.

Positions are derived deterministically from the index (not Math.random())
so repeated renders of the same scene don't visually "jump."

IMPORTANT: this component only renders the SVG shapes — each scene that
uses it must also include the `.pl-particle` / `.pl-raindrop` keyframes
in its own <style> block (same self-contained pattern every other scene
already follows). Copy the snippet from MarinaBeach.jsx or MonsoonStreet.jsx.
