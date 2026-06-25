import { BookOpen, ArrowRight } from 'lucide-react';

export default function ReadingBlock({ data, onJumpToPage }) {
  let parsed = {};
  try {
    parsed = typeof data === 'string' ? JSON.parse(data) : (data || {});
  } catch { parsed = {}; }

  const { chapter_title, chunk_index, page_estimate } = parsed;

  return (
    <div className="mt-2 border border-[#eceae4] rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#fbf9f3] border-b border-[#eceae4]">
        <BookOpen size={14} className="text-[#f5a623] flex-shrink-0" />
        <span className="text-xs font-medium text-[#1c1c1c] truncate">{chapter_title || 'Book Section'}</span>
        {page_estimate > 0 && (
          <span className="text-xs text-[#8f8a80] ml-auto flex-shrink-0">~page {page_estimate}</span>
        )}
      </div>

      {/* Jump to reading mode button */}
      {onJumpToPage && (
        <button
          onClick={() => onJumpToPage(chunk_index || 0)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#5f5f5d] hover:text-[#f5a623] hover:bg-[#fbf9f3] transition-colors group"
        >
          <span>Open in Reading Mode</span>
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
