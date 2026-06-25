import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, User } from 'lucide-react';
import VisualizationBlock from './VisualizationBlock.jsx';
import ReadingBlock from './ReadingBlock.jsx';
import { getGenreConfig } from '../../utils/genreConfig.js';

/** Render plain-text assistant content as real paragraphs, with light **bold** support. */
function FormattedContent({ text }) {
  const paragraphs = (text || '').split(/\n{2,}/).filter(Boolean);
  if (paragraphs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {paragraphs.map((para, pi) => {
        const parts = para.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={pi} className="whitespace-pre-wrap">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="text-[#1c1c1c] font-semibold">{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function MessageBubble({ message, onFollowup, onJumpToPage, genre }) {
  const isUser = message.role === 'user';
  const config = getGenreConfig(genre);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-2.5 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border"
        style={
          isUser
            ? { backgroundColor: '#f5a62315', borderColor: '#f5a62330' }
            : { backgroundColor: `${config.color}18`, borderColor: `${config.color}35` }
        }
      >
        {isUser ? (
          <User size={13} className="text-[#f5a623]" />
        ) : (
          <BookOpen size={13} style={{ color: config.color }} />
        )}
      </div>

      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
            isUser
              ? 'bg-[#f5a623]/15 text-[#1c1c1c] border-[#f5a623]/20 rounded-tr-sm'
              : 'bg-[#fbf9f3] text-[#1c1c1c] border-[#eceae4] rounded-tl-sm'
          }`}
          style={!isUser ? { borderLeftColor: `${config.color}50`, borderLeftWidth: 2 } : {}}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <FormattedContent text={message.content} />
          )}
        </motion.div>

        {/* Reading block — actual book text fetched for a "read chapter X" style request */}
        {!isUser && message.visualization_type === 'reading_block' && (
          <ReadingBlock
            data={message.visualization_html}
            onJumpToPage={onJumpToPage}
          />
        )}

        {/* Visualization */}
        {!isUser && message.visualization_type && message.visualization_type !== 'none' && message.visualization_type !== 'reading_block' && message.visualization_html && (
          <VisualizationBlock
            type={message.visualization_type}
            title={message.visualization_title}
            code={message.visualization_html}
          />
        )}

        {/* Business insight */}
        {!isUser && message.business_insight && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 flex items-start gap-2 bg-[#f5a623]/8 border border-[#f5a623]/20 rounded-xl px-3 py-2.5"
          >
            <Lightbulb size={14} className="text-[#f5a623] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#f5a623]/90 leading-relaxed">
              {message.business_insight}
            </p>
          </motion.div>
        )}

        {/* Suggested follow-ups */}
        {!isUser && message.suggested_followups?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.suggested_followups.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onFollowup?.(q)}
                className="text-xs bg-[#fbf9f3] border border-[#eceae4] text-[#5f5f5d] hover:text-[#1c1c1c] hover:border-[#b8b3a8] px-3 py-1.5 rounded-full transition-colors"
              >
                {q}
              </motion.button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] text-[#8f8a80] mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
