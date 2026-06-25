import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart2 } from 'lucide-react';

export default function VisualizationBlock({ type, title, code }) {
  const containerRef = useRef(null);

  if (!code || type === 'none') return null;

  const handleDownload = () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'visualization'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canDownload = ['scene', 'diagram', 'network', 'timeline', 'chart'].includes(type);

  // Cinematic ease-out — matches the storytelling slide mount animation.
  const CINEMATIC_EASE = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
      className="mt-3 rounded-xl overflow-hidden border border-[#eceae4] bg-[#f7f4ed]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eceae4]">
        <div className="flex items-center gap-2">
          <BarChart2 size={13} className="text-[#f5a623]" />
          <span className="text-xs text-[#5f5f5d] font-medium">
            {title || type}
          </span>
        </div>
        {canDownload && (
          <button
            onClick={handleDownload}
            className="text-[#8f8a80] hover:text-[#5f5f5d] transition-colors p-1 rounded"
            title="Download SVG"
          >
            <Download size={13} />
          </button>
        )}
      </div>

      {/* Visualization */}
      <div
        ref={containerRef}
        className="viz-container p-6 flex items-center justify-center overflow-hidden"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </motion.div>
  );
}
