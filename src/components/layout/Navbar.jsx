import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Library, BookOpen, FlaskConical, BrainCircuit, Building2, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import supabase from '../../lib/supabase.js';
import Modal from '../ui/Modal.jsx';
import BookUpload from '../book/BookUpload.jsx';
import URLIngester from '../source/URLIngester.jsx';
import TextIngester from '../source/TextIngester.jsx';
import { Upload, Link2, FileText, PenLine } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/library', label: 'Canon', icon: Library },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/lab', label: 'Lab', icon: FlaskConical },
  { to: '/memory', label: 'Memory', icon: BrainCircuit },
  { to: '/builder', label: 'Build', icon: Building2 },
];

const INTAKE_TABS = [
  { id: 'file', label: 'Upload File', icon: Upload },
  { id: 'url', label: 'Paste URL', icon: Link2 },
  { id: 'text', label: 'Paste Text', icon: FileText },
  { id: 'note', label: 'Write Note', icon: PenLine },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [intakeTab, setIntakeTab] = useState('file');

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : '?';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const openCmdPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Desktop + Tablet Navbar */}
      <nav style={{
        height: '64px', background: '#fbf9f3', borderBottom: '1px solid #eceae4',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: '0',
        position: 'sticky', top: 0, zIndex: 40
      }}>
        {/* Brand */}
        <Link to="/library" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '20px', color: '#1c1c1c', letterSpacing: '-0.02em' }}>
            Book<span style={{ color: '#f5a623' }}>Sphere</span>
          </span>
        </Link>

        {/* Center search */}
        <div style={{ flex: 1, maxWidth: '480px', margin: '0 48px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8f8a80' }} />
            <input
              placeholder="Search your canon..."
              onClick={openCmdPalette}
              readOnly
              style={{
                width: '100%', paddingLeft: '36px', paddingRight: '48px',
                height: '38px', borderRadius: '999px',
                border: '1px solid #eceae4', background: '#f3efe4',
                fontSize: '13px', color: '#5f5f5d', cursor: 'pointer',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            <kbd style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '10px', color: '#8f8a80', border: '1px solid #eceae4',
              borderRadius: '4px', padding: '1px 5px', background: '#fbf9f3', pointerEvents: 'none'
            }}>K</kbd>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px', marginRight: '24px' }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.to);
            return (
              <Link key={item.to} to={item.to} style={{
                textDecoration: 'none', fontSize: '14px', fontWeight: active ? 600 : 400,
                color: active ? '#f5a623' : '#5f5f5d',
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => { if (!active) e.target.style.color = '#1c1c1c'; }}
              onMouseLeave={e => { if (!active) e.target.style.color = '#5f5f5d'; }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Avatar + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
          <button
            onClick={() => setAddOpen(true)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%', background: '#f5a623',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Add source"
          >
            <Plus size={16} color="#1c1c1c" />
          </button>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: '#1c1c1c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fbf9f3', cursor: 'default'
          }}>
            {initials}
          </div>
          <button
            onClick={handleSignOut}
            style={{ fontSize: '12px', color: '#8f8a80', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '64px',
        background: '#fbf9f3', borderTop: '1px solid #eceae4',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 50, padding: '0 8px'
      }}>
        {NAV_ITEMS.slice(0, 2).map(item => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              textDecoration: 'none', color: active ? '#f5a623' : '#8f8a80',
              fontSize: '10px', fontWeight: active ? 600 : 400, flex: 1, padding: '8px 0'
            }}>
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}

        {/* Center + button */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setAddOpen(true)}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#f5a623', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: '-20px',
              boxShadow: '0 4px 12px rgba(245,166,35,0.4)'
            }}
          >
            <Plus size={22} color="#1c1c1c" />
          </button>
        </div>

        {NAV_ITEMS.slice(2, 4).map(item => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              textDecoration: 'none', color: active ? '#f5a623' : '#8f8a80',
              fontSize: '10px', fontWeight: active ? 600 : 400, flex: 1, padding: '8px 0'
            }}>
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Add Source Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setIntakeTab('file'); }} title="Add to Your Knowledge Base" size="lg">
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #eceae4', marginTop: '-4px' }}>
          {INTAKE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setIntakeTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', fontSize: '13px', fontWeight: intakeTab === tab.id ? 600 : 500,
                borderBottom: `2px solid ${intakeTab === tab.id ? '#f5a623' : 'transparent'}`,
                color: intakeTab === tab.id ? '#f5a623' : '#5f5f5d',
                background: 'none', border: 'none',
                cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>
        {intakeTab === 'file' && <BookUpload onUploaded={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
        {intakeTab === 'url' && <URLIngester onIngested={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
        {intakeTab === 'text' && <TextIngester onIngested={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
        {intakeTab === 'note' && <TextIngester lockedType="note" onIngested={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
      </Modal>
    </>
  );
}
