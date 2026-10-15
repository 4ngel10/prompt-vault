import { LockIcon, SunIcon, MoonIcon, PlusIcon } from './Icons';

export default function Header({ dark, onToggleTheme, onNewPrompt }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-10 py-3 sm:py-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] border-b bg-white dark:bg-dark-800 border-warm-200 dark:border-dark-600">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-2 sm:gap-2.5 min-w-0 -ml-1.5 px-1.5 py-1 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
        aria-label="Volver arriba"
      >
        <LockIcon className="w-6 h-6 shrink-0" stroke="#C3B1E1" />
        <span className="text-[17px] sm:text-[19px] font-bold tracking-tight truncate text-warm-800 dark:text-dark-100">
          Prompt Vault
        </span>
      </button>
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          onClick={onToggleTheme}
          className="w-[38px] h-[38px] rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 flex items-center justify-center text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          onClick={onNewPrompt}
          aria-label="Nuevo prompt"
          className="flex items-center gap-1.5 h-[38px] px-3 sm:px-5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
        >
          <PlusIcon />
          <span className="hidden sm:inline">Nuevo Prompt</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>
    </header>
  );
}
