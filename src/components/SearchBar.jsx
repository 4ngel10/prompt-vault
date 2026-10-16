import { SearchIcon } from './Icons';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-4 sm:mb-5">
      <SearchIcon className="w-[17px] h-[17px] absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 dark:text-dark-400" />
      <input
        type="search"
        enterKeyHint="search"
        placeholder="Buscar prompts y skills..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full py-3 sm:py-3.5 pl-11 pr-4 rounded-xl border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 placeholder:text-warm-400 dark:placeholder:text-dark-400 outline-none focus:border-lavender dark:focus:border-lavender transition-colors"
      />
    </div>
  );
}
