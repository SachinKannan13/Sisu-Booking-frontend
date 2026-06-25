import { ProcessingStatus } from 'booksphere-client';

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', background: '#1a1a1a', borderRadius: '12px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: '#9a8a78', fontSize: '13px' }}>Atomic Habits</span>
      <ProcessingStatus status="processing" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: '#9a8a78', fontSize: '13px' }}>Zero to One</span>
      <ProcessingStatus status="ready" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: '#9a8a78', fontSize: '13px' }}>The Lean Startup</span>
      <ProcessingStatus status="failed" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: '#9a8a78', fontSize: '13px' }}>Thinking Fast and Slow</span>
      <ProcessingStatus status="pending" />
    </div>
  </div>
);
