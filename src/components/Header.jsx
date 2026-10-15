import { LockIcon, SunIcon, MoonIcon, PlusIcon } from './Icons';

export default function Header({ dark, onToggleTheme, onNewPrompt }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-10 py-3.5 border-b bg-white dark:bg-dark-800 border-warm-200 dark:border-dark-600">
      <div className="flex items-center gap-2.5">
        <LockIcon className="w-6 h-6" stroke="#C3B1E1" />
        <span className="text-[19px] font-bold tracking-tight text-warm-800 dark:text-dark-100">
          Prompt Vault
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleTheme}
          className="w-[38px] h-[38px] rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 flex items-center justify-center text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          onClick={onNewPrompt}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
        >
          <PlusIcon />
          Nuevo Prompt
        </button>
      </div>
    </header>
  );
}
