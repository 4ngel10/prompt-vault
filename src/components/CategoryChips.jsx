import { EditIcon } from './Icons';

export default function CategoryChips({ categories, active, onSelect, onManage }) {
  const all = ['Todos', ...categories];
  return (
    <div className="flex gap-2 mb-6 sm:mb-7 overflow-x-auto sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {all.map(cat => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-lavender text-warm-800 dark:text-dark-900 font-semibold border-transparent'
                : 'bg-white dark:bg-dark-700 text-warm-500 dark:text-dark-200 border border-warm-200 dark:border-dark-500 hover:border-lavender'
            }`}
          >
            {cat}
          </button>
        );
      })}
      <button
        onClick={onManage}
        className="shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-dashed border-warm-200 dark:border-dark-500 text-warm-500 dark:text-dark-300 hover:border-lavender hover:text-warm-800 dark:hover:text-dark-100 transition-colors cursor-pointer"
        aria-label="Editar categorías"
      >
        <EditIcon /> Editar
      </button>
    </div>
  );
}
