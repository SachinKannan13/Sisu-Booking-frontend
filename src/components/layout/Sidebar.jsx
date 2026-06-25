import { NavLink } from 'react-router-dom';
import { Library, BookOpen, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#f5a623]/10 text-[#f5a623]'
        : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#fbf9f3]'
    }`;

  return (
    <aside className="w-56 bg-[#f7f4ed] border-r border-[#eceae4] flex flex-col pt-6 px-3">
      <nav className="flex flex-col gap-1">
        <NavLink to="/library" className={linkClass}>
          <Library size={16} />
          Library
        </NavLink>
      </nav>
    </aside>
  );
}
