import { Button } from 'booksphere-client';

// ProfileSetup uses motion.div with initial={{ opacity: 0, y: 10 }} — blank in headless capture.
// Static recreation matching the form layout exactly.

const inputStyle: any = {
  width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
  padding: '8px 12px', fontSize: '14px', color: '#f5f0e8', outline: 'none', boxSizing: 'border-box'
};
const labelStyle: any = { fontSize: '12px', color: '#9a8a78', display: 'block', marginBottom: '4px' };

const ProfilePanel = ({ profile }: any) => (
  <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '448px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div>
        <h2 style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '16px', margin: 0 }}>Your Business Profile</h2>
        <p style={{ color: '#9a8a78', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>Used to personalise stories and book insights for you</p>
      </div>
      <button style={{ color: '#5a4a3a', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={labelStyle}>Business / Startup Name *</label>
        <input readOnly style={inputStyle} value={profile?.business_name || ''} placeholder="e.g. Acme EdTech" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Industry *</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={profile?.industry || ''} onChange={() => {}}>
            <option value="">Select...</option>
            {['Technology','EdTech','FinTech','SaaS','Consulting'].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Stage *</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={profile?.stage || ''} onChange={() => {}}>
            <option value="">Select...</option>
            {[['idea','Idea stage'],['mvp','MVP / Early'],['growth','Growing'],['scale','Scaling'],['established','Established']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Team Size</label>
        <input readOnly style={inputStyle} value={profile?.team_size || ''} placeholder="e.g. just me, 3 people, 15+" />
      </div>
      <div>
        <label style={labelStyle}>Your Main Goal Right Now</label>
        <input readOnly style={inputStyle} value={profile?.main_goal || ''} placeholder="e.g. Get first 100 paying customers" />
      </div>
      <div>
        <label style={labelStyle}>Biggest Challenge Right Now</label>
        <input readOnly style={inputStyle} value={profile?.current_challenge || ''} placeholder="e.g. Struggling to scale beyond early adopters" />
      </div>
    </div>

    <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
      <button style={{ flex: 1, padding: '8px', fontSize: '14px', color: '#9a8a78', background: 'none', border: '1px solid #2a2a2a', borderRadius: '8px', cursor: 'pointer' }}>Skip for now</button>
      <div style={{ flex: 1 }}><Button>Save Profile</Button></div>
    </div>
  </div>
);

export const NewProfile = () => (
  <div style={{ background: '#0d0d0d', padding: '32px', display: 'flex', justifyContent: 'center' }}>
    <ProfilePanel />
  </div>
);

export const ExistingProfile = () => (
  <div style={{ background: '#0d0d0d', padding: '32px', display: 'flex', justifyContent: 'center' }}>
    <ProfilePanel profile={{
      business_name: 'Chennai Fintech Labs',
      industry: 'FinTech',
      stage: 'growth',
      team_size: '12',
      main_goal: 'Scale B2B payments to Tier-2 cities',
      current_challenge: 'Enterprise sales cycle and regulatory compliance'
    }} />
  </div>
);
