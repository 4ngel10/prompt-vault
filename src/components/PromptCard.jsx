import { useState, useRef, useEffect } from 'react';
import { DotsIcon, EditIcon, TrashIcon } from './Icons';
import { getCategoryColors } from '../constants';

export default function PromptCard({ prompt, dark, onEdit, onDelete, onClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const colors = getCategoryColors(prompt.category);
  const scheme = dark ? colors.dark : colors.light;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-700 rounded-[14px] p-4 sm:p-5 border border-warm-200 dark:border-dark-500 flex flex-col gap-2.5 hover:shadow-md dark:hover:border-dark-400 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-semibold leading-snug text-warm-800 dark:text-dark-100 pr-2">
          {prompt.title}
        </h3>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-9 h-9 sm:w-[30px] sm:h-[30px] -mr-1.5 -mt-1.5 sm:m-0 rounded-lg flex items-center justify-center text-warm-400 dark:text-dark-400 hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
            aria-label="Más opciones"
          >
            <DotsIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white dark:bg-dark-700 border border-warm-200 dark:border-dark-500 rounded-xl shadow-lg py-1.5 min-w-[140px] z-10">
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(false); onEdit(); }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 sm:py-2 text-[13px] text-warm-600 dark:text-dark-200 hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
              >
                <EditIcon /> Editar
              </button>
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 sm:py-2 text-[13px] text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <TrashIcon /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-[13px] text-warm-500 dark:text-dark-300 leading-relaxed line-clamp-3">
        {prompt.text}
      </p>
      <span
        className="self-start px-2.5 py-1 rounded-[10px] text-xs font-medium"
        style={{ background: scheme.bg, color: scheme.text }}
      >
        {prompt.category || 'Sin categoría'}
      </span>
    </div>
  );
}
