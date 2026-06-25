import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { ingestURL } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import toast from 'react-hot-toast';

export default function URLIngester({ onIngested, onClose }) {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) return toast.error('Enter a URL');

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      setLoading(true);
      const { data } = await ingestURL(url.trim(), tagList);
      toast.success('URL added! Extracting and analysing...');
      onIngested?.(data.id);
      onClose?.();
    } catch (err) {
      toast.error('Failed to ingest URL: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-4">
        <div className="w-10 h-10 bg-[#c85250]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Link2 size={18} className="text-[#c85250]" />
        </div>
        <p className="text-[#5f5f5d] text-xs leading-relaxed">
          Paste a link to an article, essay, or blog post. We'll extract the readable content automatically.
        </p>
      </div>

      <div>
        <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl px-4 py-2.5 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50"
        />
      </div>

      <div>
        <label className="text-[#5f5f5d] text-xs font-semibold uppercase tracking-wider mb-1.5 block">
          Tags <span className="text-[#8f8a80]">(comma-separated, optional)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="productivity, leadership"
          className="w-full bg-[#f7f4ed] border border-[#eceae4] rounded-xl px-4 py-2.5 text-sm text-[#1c1c1c] placeholder:text-[#8f8a80] focus:outline-none focus:border-[#f5a623]/50"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!url.trim()} loading={loading}>
          Add to Knowledge Base
        </Button>
      </div>
    </div>
  );
}
