import { useState, useRef, useEffect, useCallback } from 'react';
import { LockIcon, SunIcon, MoonIcon, PlusIcon, ChevronDownIcon, BoltIcon, LogoutIcon, GoogleIcon, GearIcon } from './Icons';

// Cierra un menú al hacer clic fuera o pulsar Escape
function useDismiss(ref, open, close) {
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, close]);
}

function initialsFrom(email = '') {
  const parts = email.split('@')[0].split(/[._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? '?').slice(0, 2);
  return letters.toUpperCase();
}

function Avatar({ url, email }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-[34px] h-[34px] rounded-full object-cover"
      />
    );
  }
  return (
    <span className="w-[34px] h-[34px] rounded-full bg-lavender text-warm-800 dark:text-dark-900 text-[12px] font-bold flex items-center justify-center select-none">
      {initialsFrom(email)}
    </span>
  );
}

const menuPanelClass = 'absolute right-0 top-[46px] bg-white dark:bg-dark-700 border border-warm-200 dark:border-dark-500 rounded-xl shadow-lg py-1.5 z-30 animate-in';
const menuItemClass = 'w-full flex items-center gap-2.5 px-3.5 py-2.5 sm:py-2 text-[13px] text-warm-600 dark:text-dark-200 hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer';

export default function Header({ dark, onToggleTheme, onNew, onHome, onOpenSettings, user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);

  useDismiss(menuRef, menuOpen, closeMenu);
  useDismiss(accountRef, accountOpen, closeAccount);

  const email = user?.email ?? '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name;
  const isGoogle = user?.app_metadata?.provider === 'google';

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
          onClick={onOpenSettings}
          title="Personalizar colores"
          className="hidden sm:flex w-[38px] h-[38px] rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 items-center justify-center text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          aria-label="Personalizar colores"
        >
          <GearIcon />
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
            <div role="menu" className={`${menuPanelClass} min-w-[170px]`}>
              <button role="menuitem" onClick={() => choose('prompt')} className={menuItemClass}>
                <span className="w-5 h-5 rounded-md bg-lavender/30 text-[#5B4682] dark:text-lavender flex items-center justify-center">
                  <PlusIcon className="w-3 h-3" />
                </span>
                Nuevo Prompt
              </button>
              <button role="menuitem" onClick={() => choose('skill')} className={menuItemClass}>
                <span className="w-5 h-5 rounded-md bg-mint/30 text-[#2E6644] dark:text-mint flex items-center justify-center">
                  <BoltIcon />
                </span>
                Nueva Skill
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={accountRef}>
          <button
            onClick={() => setAccountOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            aria-label={`Cuenta: ${email}`}
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center hover:ring-2 hover:ring-lavender/60 transition cursor-pointer"
          >
            <Avatar url={avatarUrl} email={email} />
          </button>
          {accountOpen && (
            <div role="menu" className={`${menuPanelClass} min-w-[220px] max-w-[calc(100vw-2rem)]`}>
              <div className="px-3.5 pt-1.5 pb-2.5 flex flex-col gap-1.5">
                {fullName && (
                  <p className="text-[13px] font-semibold text-warm-800 dark:text-dark-100 truncate">{fullName}</p>
                )}
                <p className="text-[13px] text-warm-500 dark:text-dark-300 truncate" title={email}>{email}</p>
                <span className="self-start inline-flex items-center gap-1 px-2 py-[2px] rounded-md bg-warm-100 dark:bg-dark-600 text-[11px] font-medium text-warm-600 dark:text-dark-200">
                  {isGoogle ? <><GoogleIcon className="w-3 h-3" /> Google</> : 'Email'}
                </span>
              </div>
              <div className="border-t border-warm-200 dark:border-dark-500 my-1" />
              <button
                role="menuitem"
                onClick={() => { setAccountOpen(false); onOpenSettings(); }}
                className={menuItemClass}
              >
                <GearIcon className="w-[15px] h-[15px]" />
                Personalizar colores
              </button>
              <button
                role="menuitem"
                onClick={() => { setAccountOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 sm:py-2 text-[13px] text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogoutIcon className="w-[15px] h-[15px]" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
