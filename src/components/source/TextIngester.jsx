import { useState } from 'react';
import { ingestText } from '../../lib/api.js';
import { SOURCE_TYPE_COLORS } from '../../constants/learningModes.js';
import Button from '../ui/Button.jsx';
import toast from 'react-hot-toast';

const TEXT_SOURCE_TYPES = ['article', 'essay', 'paper', 'transcript', 'interview', 'note'];

export default function TextIngester({ lockedType, onIngested, onClose }) {
  const [sourceType, setSourceType] = useState(lockedType || 'note');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error('Paste some content first');

    try {
      setLoading(true);
      const { data } = await ingestText({
        title: title.trim() || undefined,
        author: author.trim() || undefined,
        text: content,
        source_type: sourceType
      });
      toast.success('Added! Analysing in the background...');
      onIngested?.(data.id);
      onClose?.();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!lockedType && (
        <div>
          <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Type</label>
          <div className="flex flex-wrap gap-2">
            {TEXT_SOURCE_TYPES.map(t => {
              const color = SOURCE_TYPE_COLORS[t] || '#5f5f5d';
              const active = sourceType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSourceType(t)}
                  className="text-xs px-3 py-1.5 rounded-full border capitalize transition-colors"
                  style={active ? { borderColor: color, color } : { borderColor: '#eceae4', color: '#5f5f5d' }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={lockedType === 'note' ? 'Untitled Note' : 'Title'}
            className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl px-4 py-2.5 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50"
          />
        </div>
        <div>
          <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Optional"
            className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl px-4 py-2.5 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50"
          />
        </div>
      </div>

      <div>
        <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">
          {sourceType === 'transcript' || sourceType === 'interview' ? 'Transcript' : 'Content'}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder={
            sourceType === 'transcript' || sourceType === 'interview'
              ? 'Paste the transcript — speaker labels and timestamps are handled automatically...'
              : 'Paste or write your content...'
          }
          className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-4 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50 resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!content.trim()} loading={loading}>
          Add to Knowledge Base
        </Button>
      </div>
    </div>
  );
}
