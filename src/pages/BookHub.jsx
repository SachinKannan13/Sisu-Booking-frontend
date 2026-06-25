import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, MessageCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import ReadingMode from '../components/book/ReadingMode.jsx';
import ChatInterface from '../components/chat/ChatInterface.jsx';
import GenreBadge from '../components/ui/GenreBadge.jsx';
import { getBook } from '../lib/api.js';
import { getGenreConfig } from '../utils/genreConfig.js';
import toast from 'react-hot-toast';

// Note: the "Stories" tab (Chennai storytelling feature) has been retired
// as part of the Learning OS upgrade — see server/legacy + client/src/legacy.
// This hub now only handles per-source Read + Chat; cross-source learning
// (Scholar/Critic/Synthesizer/Practitioner/Teacher/Lab) lives at /learn.
const TABS = [
  { id: 'read', label: 'Read', icon: BookOpen },
  { id: 'chat', label: 'Chat', icon: MessageCircle }
];

export default function BookHub() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('read');
  const [targetChunk, setTargetChunk] = useState(null);

  const genreConf = book ? getGenreConfig(book.genre) : null;

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data } = await getBook(id);
      setBook(data);
    } catch (err) {
      toast.error('Book not found');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col h-screen overflow-hidden">
      <Navbar />

      {/* Book header */}
      <div
        className="flex-shrink-0 border-b border-[#eceae4] px-6 py-4"
        style={{ borderTop: `2px solid ${genreConf?.color || '#f5a623'}` }}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(`/source/${id}`)}
            className="text-[#5f5f5d] hover:text-[#1c1c1c] mt-1 transition-colors p-1 rounded-lg hover:bg-[#fbf9f3]"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-[#1c1c1c] truncate">{book.title}</h1>
              <GenreBadge genre={book.genre} />
            </div>
            <p className="text-[#5f5f5d] text-sm mt-0.5">by {book.author}</p>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#8f8a80]">
            {book.word_count > 0 && (
              <span>{Math.round(book.word_count / 250)} pages</span>
            )}
            {book.ideal_reader_stage && (
              <span className="capitalize">Best for: {book.ideal_reader_stage}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-[#1c1c1c] bg-[#fbf9f3]'
                  : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#fbf9f3]/50'
              }`}
              style={activeTab === tab.id ? { color: genreConf?.color } : {}}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activeTab === 'read' && (
              <ReadingMode book={book} targetChunk={targetChunk} onTargetChunkConsumed={() => setTargetChunk(null)} />
            )}

            {activeTab === 'chat' && (
              <ChatInterface
                book={book}
                onJumpToPage={(chunkIndex) => {
                  setActiveTab('read');
                  setTargetChunk(chunkIndex);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
