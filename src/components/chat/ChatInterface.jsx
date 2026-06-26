import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Building2, X, BookOpen } from 'lucide-react';
import { useChat } from '../../hooks/useChat.js';
import MessageBubble from './MessageBubble.jsx';
import { SpinnerOverlay } from '../ui/LoadingScreen.jsx';
import Button from '../ui/Button.jsx';
import GenreBadge from '../ui/GenreBadge.jsx';
import { getGenreConfig } from '../../utils/genreConfig.js';

// Detects organic business intent in a typed message — no API call needed.
const BUSINESS_INTENT_RE = /my (startup|business|company)|apply (this|it) to/i;

export default function ChatInterface({ book, onJumpToPage, pinnedPassage = null, onPinnedPassageConsumed }) {
  const { messages, sending, historyLoading, loadHistory, send, clear } = useChat(book.id);
  const [input, setInput] = useState('');
  const [pendingMode, setPendingMode] = useState('reading');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const genreConf = getGenreConfig(book.genre);

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When the reader sends a passage via "Ask AI about this", pre-fill the
  // input with the passage as pinned context so the user can add their question.
  useEffect(() => {
    if (!pinnedPassage?.text) return;
    setInput(`About this passage:\n"${pinnedPassage.text}"\n\n`);
    onPinnedPassageConsumed?.();
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [pinnedPassage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const msg = input.trim();
    const mode = pendingMode === 'business' || BUSINESS_INTENT_RE.test(msg) ? 'business' : 'reading';
    setInput('');
    setPendingMode('reading'); // one-time lens — reverts after this send
    await send(msg, mode);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFollowup = (q) => setInput(q);

  const handleApplyBusiness = () => {
    setInput(`I'm building a startup in ${book.themes?.[0] ? 'this space' : 'my industry'}. How does this book apply to my situation?`);
    setPendingMode('business');
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Book context card */}
      <div className="px-6 py-3 border-b border-[#eceae4] flex items-center gap-4 flex-wrap">
        <GenreBadge genre={book.genre} />
        {book.tone && (
          <span className="text-xs text-[#5f5f5d]">Tone: {book.tone.split(' ').slice(0, 4).join(' ')}</span>
        )}
        {book.themes?.slice(0, 3).map(t => (
          <span key={t} className="text-xs bg-[#fbf9f3] border border-[#eceae4] text-[#5f5f5d] px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
        <button
          onClick={handleApplyBusiness}
          className="ml-auto flex items-center gap-1.5 text-xs bg-[#f5a623]/10 border border-[#f5a623]/20 text-[#f5a623] px-3 py-1.5 rounded-full hover:bg-[#f5a623]/15 transition-all"
        >
          <Building2 size={12} />
          Apply to my business
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {historyLoading ? (
          <SpinnerOverlay message="Loading conversation..." />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
            <div className="w-16 h-16 bg-[#fbf9f3] rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h3 className="text-[#1c1c1c] font-semibold mb-1">Ask anything about {book.title}</h3>
              <p className="text-[#5f5f5d] text-sm">
                I'll answer in the voice of this {book.genre} book — plot, characters, themes, and meaning.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {[
                'What are the main themes of this book?',
                `Tell me about ${book.title}'s central character`,
                'Summarize the key turning point in the story'
              ].map(q => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-left text-xs text-[#5f5f5d] bg-[#fbf9f3] border border-[#eceae4] rounded-xl px-4 py-2.5 hover:border-[#b8b3a8] hover:text-[#1c1c1c] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} onFollowup={handleFollowup} onJumpToPage={onJumpToPage} genre={book.genre} />
            ))}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 mb-4"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border"
                  style={{ backgroundColor: `${genreConf.color}18`, borderColor: `${genreConf.color}35` }}
                >
                  <BookOpen size={13} style={{ color: genreConf.color }} />
                </div>
                <div className="bg-[#fbf9f3] border border-[#eceae4] rounded-2xl rounded-tl-sm px-4 py-3" style={{ borderLeftColor: `${genreConf.color}50`, borderLeftWidth: 2 }}>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: genreConf.color }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-[#eceae4]">
        {pendingMode === 'business' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2 w-fit bg-[#f5a623]/10 border border-[#f5a623]/25 text-[#f5a623] text-xs px-3 py-1.5 rounded-full"
          >
            <Building2 size={12} />
            Business mode — this answer will connect to your startup
            <button
              onClick={() => setPendingMode('reading')}
              className="ml-1 text-[#f5a623]/70 hover:text-[#f5a623] transition-colors"
              title="Cancel business mode"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
        <div className="flex gap-2 items-end bg-[#fbf9f3] border border-[#eceae4] rounded-2xl px-4 py-2 focus-within:border-[#b8b3a8] transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${book.title}...`}
            rows={1}
            className="flex-1 bg-transparent text-[#1c1c1c] text-sm resize-none outline-none placeholder:text-[#8f8a80] min-h-[24px] max-h-[120px] py-1"
            style={{ scrollbarWidth: 'thin' }}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clear}
              className="text-[#8f8a80] hover:text-[#5f5f5d] transition-colors p-1"
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-8 h-8 bg-[#f5a623] rounded-xl flex items-center justify-center text-[#1c1c1c] hover:bg-[#e09520] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <p className="text-[#5f5f5d] text-[10px] mt-1.5 text-center">
          Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
