import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Library, BookOpen, FlaskConical, BrainCircuit, Building2, Plus, Upload, Link2, FileText, PenLine } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import supabase from '../../lib/supabase.js';
import Modal from '../ui/Modal.jsx';
import BookUpload from '../book/BookUpload.jsx';
import URLIngester from '../source/URLIngester.jsx';
import TextIngester from '../source/TextIngester.jsx';

const NAV_ITEMS = [
  { to: '/library', label: 'Canon',  icon: Library    },
  { to: '/learn',   label: 'Learn',  icon: BookOpen   },
  { to: '/lab',     label: 'Lab',    icon: FlaskConical },
  { to: '/memory',  label: 'Memory', icon: BrainCircuit },
  { to: '/builder', label: 'Build',  icon: Building2  },
];

const INTAKE_TABS = [
  { id: 'file', label: 'Upload File', icon: Upload  },
  { id: 'url',  label: 'Paste URL',  icon: Link2   },
  { id: 'text', label: 'Paste Text', icon: FileText },
  { id: 'note', label: 'Write Note', icon: PenLine  },
];

// Custom easing that matches the design-system token --ease-out
const EASE_OUT = [0.23, 1, 0.32, 1];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useApp();
  const [addOpen,   setAddOpen]   = useState(false);
  const [intakeTab, setIntakeTab] = useState('file');

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '?';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const openCmdPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* ── Desktop + Tablet Navbar ── */}
      <nav className="nav-bar h-16 bg-[#fbf9f3] border-b border-[#eceae4] flex items-center px-6 sticky top-0 z-40 backdrop-blur-sm">

        {/* Brand */}
        <Link to="/library" className="no-underline flex-shrink-0">
          <span className="font-bold text-[20px] text-[#1c1c1c] tracking-tight leading-none">
            Book<span className="text-[#f5a623]">Sphere</span>
          </span>
        </Link>

        {/* Center search — triggers command palette */}
        <div className="flex-1 max-w-[480px] mx-12">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8a80] pointer-events-none" />
            <input
              placeholder="Search your canon..."
              onClick={openCmdPalette}
              readOnly
              className="w-full h-[38px] pl-9 pr-12 rounded-full border border-[#eceae4] bg-[#f3efe4]
                         text-[13px] text-[#5f5f5d] cursor-pointer outline-none
                         focus:border-[#d6d2c7] transition-colors duration-150"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8f8a80]
                            border border-[#eceae4] rounded px-1 py-px bg-[#fbf9f3] pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Desktop nav links — layout-animated active amber dot */}
        <div className="hidden md:flex items-center gap-7 mr-6">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative no-underline text-[14px] pb-0.5 transition-colors duration-150
                  ${active ? 'font-semibold text-[#f5a623]' : 'font-normal text-[#5f5f5d] hover:text-[#1c1c1c]'}`}
              >
                {item.label}
                {/* Animated underline indicator */}
                {active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-[#f5a623] rounded-full"
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Add + Avatar + Sign out */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* + Add source button with press feedback */}
          <motion.button
            onClick={() => setAddOpen(true)}
            whileTap={{ scale: 0.93 }}
            transition={{ duration: 0.1, ease: EASE_OUT }}
            className="w-8 h-8 rounded-full bg-[#f5a623] border-none cursor-pointer
                       flex items-center justify-center
                       hover:bg-[#e09520] transition-colors duration-150"
            title="Add to your knowledge base (⌘+K)"
            aria-label="Add source"
          >
            <Plus size={16} color="#1c1c1c" strokeWidth={2.5} />
          </motion.button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center
                          text-[11px] font-bold text-[#fbf9f3] select-none cursor-default"
               title={user?.email}>
            {initials}
          </div>

          <button
            onClick={handleSignOut}
            className="text-[12px] text-[#8f8a80] hover:text-[#5f5f5d] bg-transparent border-none
                       cursor-pointer transition-colors duration-150 hidden sm:block"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#fbf9f3]
                      border-t border-[#eceae4] flex items-center justify-around z-50 px-2">
        {NAV_ITEMS.slice(0, 2).map(item => {
          const active = isActive(item.to);
          const Icon   = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 no-underline text-[10px] flex-1 py-2
                ${active ? 'font-semibold text-[#f5a623]' : 'font-normal text-[#8f8a80]'}`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}

        {/* Center FAB */}
        <div className="flex-1 flex justify-center">
          <motion.button
            onClick={() => setAddOpen(true)}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.1, ease: EASE_OUT }}
            className="w-12 h-12 rounded-full bg-[#f5a623] border-none cursor-pointer
                       flex items-center justify-center -mt-5
                       shadow-[0_4px_16px_rgba(245,166,35,0.45)]
                       hover:bg-[#e09520] transition-colors duration-150"
            aria-label="Add source"
          >
            <Plus size={22} color="#1c1c1c" strokeWidth={2.5} />
          </motion.button>
        </div>

        {NAV_ITEMS.slice(2, 4).map(item => {
          const active = isActive(item.to);
          const Icon   = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 no-underline text-[10px] flex-1 py-2
                ${active ? 'font-semibold text-[#f5a623]' : 'font-normal text-[#8f8a80]'}`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Add Source Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); setIntakeTab('file'); }}
        title="Add to Your Knowledge Base"
        size="lg"
      >
        {/* Intake tab strip */}
        <div className="flex gap-0 -mt-1 mb-5 border-b border-[#eceae4]">
          {INTAKE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setIntakeTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[13px] border-none bg-transparent
                         cursor-pointer transition-all duration-150
                         border-b-2 -mb-px
                         ${intakeTab === tab.id
                           ? 'font-semibold text-[#f5a623] border-[#f5a623]'
                           : 'font-medium text-[#5f5f5d] border-transparent hover:text-[#1c1c1c]'}`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={intakeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
          >
            {intakeTab === 'file' && <BookUpload  onUploaded={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
            {intakeTab === 'url'  && <URLIngester  onIngested={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
            {intakeTab === 'text' && <TextIngester onIngested={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
            {intakeTab === 'note' && <TextIngester lockedType="note" onIngested={() => setAddOpen(false)} onClose={() => setAddOpen(false)} />}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </>
  );
}
