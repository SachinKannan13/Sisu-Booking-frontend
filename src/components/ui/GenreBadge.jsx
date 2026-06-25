import { getGenreConfig } from '../../utils/genreConfig.js';

export default function GenreBadge({ genre, size = 'sm' }) {
  const config = getGenreConfig(genre);

  const sizes = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizes[size]}`}
      style={{ backgroundColor: config.bgColor, color: config.color, border: `1px solid ${config.color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}
