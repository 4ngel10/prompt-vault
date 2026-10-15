import { CATEGORIES } from '../constants';

export default function CategoryChips({ active, onSelect }) {
  const all = ['Todos', ...CATEGORIES];
  return (
    <div className="flex gap-2 mb-7 flex-wrap">
      {all.map(cat => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-lavender text-warm-800 dark:text-dark-900 font-semibold border-transparent'
                : 'bg-white dark:bg-dark-700 text-warm-500 dark:text-dark-200 border border-warm-200 dark:border-dark-500 hover:border-lavender'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
