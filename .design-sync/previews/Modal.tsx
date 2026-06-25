import { Button } from 'booksphere-client';

// Modal uses fixed+AnimatePresence which captures blank at opacity:0 in headless.
// These previews render the modal panel directly in a simulated dark backdrop —
// same visual result as the open state, without relying on framer-motion initial render.

const ModalPanel = ({ title, children, size = 'md' }: any) => {
  const maxWidths: any = { sm: '448px', md: '512px', lg: '672px', xl: '896px' };
  return (
    <div style={{ background: '#0d0d0d', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <div style={{ background: 'rgba(0,0,0,0.7)', position: 'absolute', inset: 0 }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: maxWidths[size],
        background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px',
        overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #2a2a2a' }}>
          <h2 style={{ color: '#f5f0e8', fontSize: '18px', fontWeight: 600, margin: 0 }}>{title}</h2>
          <span style={{ color: '#9a8a78', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>✕</span>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

export const DeleteConfirmation = () => (
  <ModalPanel title="Confirm Delete" size="sm">
    <p style={{ color: '#9a8a78', marginBottom: '20px', fontSize: '14px', lineHeight: 1.6 }}>
      Are you sure you want to remove this book from your library? This action cannot be undone.
    </p>
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button variant="danger" size="sm">Delete Book</Button>
    </div>
  </ModalPanel>
);

export const UploadBook = () => (
  <ModalPanel title="Upload a Book" size="md">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: '#9a8a78', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
        Upload a PDF or EPUB file to generate your personalised story experience in Chennai.
      </p>
      <div style={{ border: '2px dashed #333', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#5a4a3a', fontSize: '14px' }}>
        Drop file here or click to browse
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="md">Cancel</Button>
        <Button variant="primary" size="md">Upload</Button>
      </div>
    </div>
  </ModalPanel>
);

export const GenreSelection = () => (
  <ModalPanel title="Select a Genre" size="md">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: '#9a8a78', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
        Choose the genre that best matches your book to personalise the storytelling experience.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['Thriller', 'Romance', 'Self-Help', 'Fantasy', 'Historical', 'Educational'].map(g => (
          <span key={g} style={{ padding: '8px 16px', background: '#242424', border: '1px solid #333', borderRadius: '8px', color: '#f5f0e8', fontSize: '13px', cursor: 'pointer' }}>{g}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="md">Cancel</Button>
        <Button variant="primary" size="md">Confirm</Button>
      </div>
    </div>
  </ModalPanel>
);
