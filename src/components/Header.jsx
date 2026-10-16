import { useState, useRef, useEffect } from 'react';
import { LockIcon, SunIcon, MoonIcon, PlusIcon, ChevronDownIcon, BoltIcon, LogoutIcon } from './Icons';

export default function Header({ dark, onToggleTheme, onNew, onHome, userEmail, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const choose = (type) => {
    setMenuOpen(false);
    onNew(type);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-10 py-3 sm:py-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] border-b bg-white dark:bg-dark-800 border-warm-200 dark:border-dark-600">
      <button
        onClick={() => { onHome(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="flex items-center gap-2 sm:gap-2.5 min-w-0 -ml-1.5 px-1.5 py-1 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
        aria-label="Ir al inicio"
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
          onClick={onSignOut}
          title={userEmail ? `Cerrar sesión (${userEmail})` : 'Cerrar sesión'}
          className="w-[38px] h-[38px] rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 flex items-center justify-center text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 hover:text-danger dark:hover:text-danger transition-colors cursor-pointer"
          aria-label="Cerrar sesión"
        >
          <LogoutIcon />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-1.5 h-[38px] px-3 sm:px-4 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
          >
            <PlusIcon />
            <span>Nuevo</span>
            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[46px] bg-white dark:bg-dark-700 border border-warm-200 dark:border-dark-500 rounded-xl shadow-lg py-1.5 min-w-[170px] z-30"
            >
              <button
                role="menuitem"
                onClick={() => choose('prompt')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 sm:py-2 text-[13px] text-warm-600 dark:text-dark-200 hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
              >
                <span className="w-5 h-5 rounded-md bg-lavender/30 text-[#5B4682] dark:text-lavender flex items-center justify-center">
                  <PlusIcon className="w-3 h-3" />
                </span>
                Nuevo Prompt
              </button>
              <button
                role="menuitem"
                onClick={() => choose('skill')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 sm:py-2 text-[13px] text-warm-600 dark:text-dark-200 hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
              >
                <span className="w-5 h-5 rounded-md bg-mint/30 text-[#2E6644] dark:text-mint flex items-center justify-center">
                  <BoltIcon />
                </span>
                Nueva Skill
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
