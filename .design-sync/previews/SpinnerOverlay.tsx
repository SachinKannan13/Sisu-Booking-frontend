import { SpinnerOverlay } from 'booksphere-client';

export const Default = () => (
  <div style={{ background: '#0d0d0d', padding: '16px' }}>
    <SpinnerOverlay />
  </div>
);

export const WithMessages = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#0d0d0d', padding: '16px' }}>
    <SpinnerOverlay message="Loading chapters..." />
    <SpinnerOverlay message="Saving your progress..." />
    <SpinnerOverlay message="Generating your story..." />
  </div>
);
