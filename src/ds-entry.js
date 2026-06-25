// Synthetic barrel — re-exports all design-system components as named exports
// for the claude.ai/design sync. Not imported by the app.

// Provider wrapper for previews that need router + auth + profile context
export { BooksphereProvider } from './ds-provider.jsx';

// UI
export { default as Button } from './components/ui/Button.jsx';
export { default as Modal } from './components/ui/Modal.jsx';
export { default as GenreBadge } from './components/ui/GenreBadge.jsx';
export { default as ProcessingStatus } from './components/ui/ProcessingStatus.jsx';
export { StoryLoadingScreen, SpinnerOverlay } from './components/ui/LoadingScreen.jsx';

// Layout
export { default as Sidebar } from './components/layout/Sidebar.jsx';
export { default as Navbar } from './components/layout/Navbar.jsx';

// Book
export { default as BookCard } from './components/book/BookCard.jsx';
export { default as BookUpload } from './components/book/BookUpload.jsx';
export { default as ChapterNav } from './components/book/ChapterNav.jsx';
export { default as ReadingMode } from './components/book/ReadingMode.jsx';

// Chat
export { default as ChatInterface } from './components/chat/ChatInterface.jsx';
export { default as MessageBubble } from './components/chat/MessageBubble.jsx';
export { default as ReadingBlock } from './components/chat/ReadingBlock.jsx';
export { default as VisualizationBlock } from './components/chat/VisualizationBlock.jsx';

// Profile
export { default as ProfileSetup } from './components/profile/ProfileSetup.jsx';

// Learning OS — Source intake
export { default as URLIngester } from './components/source/URLIngester.jsx';
export { default as TextIngester } from './components/source/TextIngester.jsx';

// Learning OS — Learn
export { default as StructuredResponse } from './components/learn/StructuredResponse.jsx';
export { default as TeacherProgress } from './components/learn/TeacherProgress.jsx';
export { default as ConceptGraph } from './components/learn/ConceptGraph.jsx';

// Note: the Chennai storytelling component library (ChennaiMap,
// StorySlideshow, InputWizard, SlideCard, ParticleCanvas, and 23 scene
// templates) was retired as part of the Learning OS upgrade and moved to
// client/src/legacy/storytelling/ — no longer exported here.
