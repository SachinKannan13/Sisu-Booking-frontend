import { SpinnerOverlay } from 'booksphere-client';

// StoryLoadingScreen uses fixed inset-0 (full page overlay with framer-motion initial opacity:0).
// Preview shows the same visual using a contained version.

const LoadingScreenPreview = ({ bookTitle }: any) => (
  <div style={{ background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', gap: '32px', textAlign: 'center', maxWidth: '448px', margin: '0 auto' }}>
    {/* Shimmer background */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', backgroundSize: '200% 100%', pointerEvents: 'none' }} />
    {/* Animated book icon */}
    <div style={{ width: '80px', height: '80px', background: 'rgba(245, 166, 35, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 166, 35, 0.2)' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="1.5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    </div>
    {bookTitle && <p style={{ color: '#9a8a78', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{bookTitle}</p>}
    <h2 style={{ color: '#f5f0e8', fontSize: '24px', fontWeight: 600, margin: 0 }}>Generating Your Story</h2>
    <p style={{ color: '#f5a623', fontSize: '16px', margin: 0 }}>Mapping your journey through Chennai...</p>
    {/* Progress dots */}
    <div style={{ display: 'flex', gap: '8px' }}>
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f5a623', opacity: i === 1 ? 1 : 0.25 }} />
      ))}
    </div>
    <p style={{ color: '#5a4a3a', fontSize: '13px', margin: 0 }}>This takes 60–120 seconds — Chennai, and the art for each scene, are being built around you...</p>
  </div>
);

export const AtomicHabits = () => (
  <div style={{ background: '#0d0d0d', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <LoadingScreenPreview bookTitle="Atomic Habits" />
  </div>
);

export const SpinnerVariants = () => (
  <div style={{ background: '#0d0d0d', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <SpinnerOverlay message="Loading chapters..." />
    <SpinnerOverlay message="Saving your progress..." />
  </div>
);
