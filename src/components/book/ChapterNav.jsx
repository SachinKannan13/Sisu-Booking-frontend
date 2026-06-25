import { ScrollArea } from '@/components/ui/shadcn/scroll-area.jsx';
import { Progress } from '@/components/ui/shadcn/progress.jsx';

export default function ChapterNav({ chapters = [], currentPage, totalPages, currentChapterTitle, onPageChange, onChapterClick }) {
  const progressPct = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#eceae4] shrink-0">
        <p className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">Chapters</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {chapters.length > 0 ? (
            chapters.map((ch, i) => {
              const label = ch.chapter || ('Chapter ' + (i + 1));
              // Active if current chapter title contains the first 20 chars of this chapter label
              const isActive = currentChapterTitle
                ? currentChapterTitle.toLowerCase().includes(label.toLowerCase().slice(0, 20))
                : false;
              return (
                <button
                  key={i}
                  onClick={() => onChapterClick && onChapterClick(label)}
                  className={
                    'w-full text-left px-4 py-3 text-xs transition-all border-l-2 hover:bg-[#f7f4ed] ' +
                    (isActive
                      ? 'border-[#f5a623] bg-[#f7f4ed] text-[#1c1c1c] font-medium'
                      : 'border-transparent text-[#5f5f5d] hover:text-[#1c1c1c]')
                  }
                >
                  <span className="line-clamp-2 leading-relaxed">{label}</span>
                  {ch.key_lesson && (
                    <span className="text-[#8f8a80] text-[10px] block mt-0.5 line-clamp-1">{ch.key_lesson}</span>
                  )}
                </button>
              );
            })
          ) : (
            Array.from({ length: Math.min(totalPages, 30) }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange && onPageChange(i + 1)}
                className={
                  'w-full text-left px-4 py-2 text-xs transition-all ' +
                  (i + 1 === currentPage
                    ? 'text-[#f5a623] font-semibold bg-[#f7f4ed]'
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#f7f4ed]')
                }
              >
                Page {i + 1}
              </button>
            ))
          )}
          {chapters.length === 0 && totalPages > 30 && (
            <p className="text-[#8f8a80] text-xs px-4 py-2">+{totalPages - 30} more pages</p>
          )}
        </div>
      </ScrollArea>

      {/* Reading progress footer */}
      <div className="px-4 py-3 border-t border-[#eceae4] shrink-0">
        <div className="flex justify-between text-xs text-[#8f8a80] mb-2">
          <span>Page {currentPage} of {totalPages}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <Progress value={progressPct} className="h-1" />
      </div>
    </div>
  );
}
