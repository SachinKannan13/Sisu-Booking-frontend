import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { getGenreConfig } from '../../utils/genreConfig.js';
import GenreBadge from '../ui/GenreBadge.jsx';
import ProcessingStatus from '../ui/ProcessingStatus.jsx';
import { SOURCE_TYPE_COLORS } from '../../constants/learningModes.js';

export default function BookCard({ book, onClick, showConnectionReason, connectionReason, onDelete }) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const genreConf = getGenreConfig(book.genre);
  const coverColor = book.cover_color || genreConf?.color || '#1a3a5c';
  const isReady = book.status === 'ready';

  const handleClick = () => {
    if (onClick) return onClick(book);
    if (isReady) navigate(`/source/${book.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await onDelete(book.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isReady ? -4 : 0 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      style={{
        display: 'flex', flexDirection: 'column', borderRadius: '12px',
        overflow: 'hidden', border: '1px solid #eceae4', background: '#fbf9f3',
        cursor: isReady ? 'pointer' : 'default', transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* Cover */}
      <div style={{
        height: '180px', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, ${coverColor}ee 0%, ${coverColor}66 50%, ${coverColor}33 100%)`
      }}>
        {book.source_type && book.source_type !== 'book' && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '999px',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            color: SOURCE_TYPE_COLORS[book.source_type] || '#fbf9f3'
          }}>
            {book.source_type}
          </span>
        )}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          <GenreBadge genre={book.genre} />
        </div>
        {/* Delete button — revealed on hover */}
        {onDelete && !confirmDelete && (
          <motion.button
            onClick={handleDeleteClick}
            title="Delete book"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#fbf9f3', pointerEvents: hovered ? 'auto' : 'none'
            }}
          >
            <Trash2 size={13} />
          </motion.button>
        )}
        {/* Delete confirmation overlay */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(30,10,10,0.82)', backdropFilter: 'blur(2px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '16px'
              }}
            >
              <p style={{ color: '#fbf9f3', fontSize: '12px', textAlign: 'center', lineHeight: 1.4 }}>
                Delete this book? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  style={{
                    padding: '5px 14px', borderRadius: '6px', border: 'none',
                    background: '#c85250', color: '#fff', fontSize: '12px',
                    fontWeight: 600, cursor: deleting ? 'default' : 'pointer',
                    opacity: deleting ? 0.7 : 1
                  }}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
                <button
                  onClick={handleCancelDelete}
                  style={{
                    padding: '5px 14px', borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'transparent', color: '#fbf9f3',
                    fontSize: '12px', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isReady && !confirmDelete && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(247,244,237,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '2px solid rgba(245,166,35,0.2)', borderTopColor: '#f5a623',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '40px 12px 12px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.4))'
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {book.title}
          </p>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{
          fontSize: '13px', fontWeight: 600, color: '#1c1c1c', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {book.title}
        </p>
        <p style={{ fontSize: '12px', color: '#5f5f5d' }}>{book.author || 'Unknown'}</p>
        {showConnectionReason && connectionReason && (
          <p style={{ fontSize: '11px', color: '#a9690f', fontStyle: 'italic', marginTop: '2px' }}>← {connectionReason}</p>
        )}
        <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ProcessingStatus status={book.status} />
          {isReady && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/learn', { state: { sourceId: book.id, sourceName: book.title } }); }}
              style={{
                fontSize: '10px', fontWeight: 600, color: '#f5a623',
                background: '#fef3dc', border: 'none', borderRadius: '6px',
                padding: '3px 8px', cursor: 'pointer'
              }}
            >
              Study →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
