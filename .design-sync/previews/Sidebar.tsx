import { Sidebar } from 'booksphere-client';

export const Default = () => (
  <div style={{ display: 'flex', height: '400px', background: '#0d0d0d' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '24px', color: '#9a8a78', fontSize: '14px' }}>
      Main content area
    </div>
  </div>
);
