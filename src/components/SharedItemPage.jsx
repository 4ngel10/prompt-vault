import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { COLOR_PALETTE, getCategoryColors, getDefaultTypeColorKey, softVars } from '../constants';
import { BoltIcon, CheckIcon, CopyIcon, LockIcon, MoonIcon, SunIcon } from './Icons';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Vista pública de un item compartido por enlace (?s=<token>). No requiere cuenta.
export default function SharedItemPage({ token, dark, onToggleTheme }) {
  const [state, setState] = useState(() => (UUID_RE.test(token) ? { status: 'loading' } : { status: 'missing' }));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!UUID_RE.test(token)) return;
    let cancelled = false;
    supabase.rpc('get_shared_item', { p_token: token }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setState({ status: 'error' });
      else if (!data?.length) setState({ status: 'missing' });
      else setState({ status: 'ok', item: data[0] });
    });
    return () => { cancelled = true; };
  }, [token]);

  const item = state.item;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const category = item?.category ? (dark ? getCategoryColors(item.category).dark : getCategoryColors(item.category).light) : null;
  const typeColor = item ? COLOR_PALETTE[getDefaultTypeColorKey(item.type_id)] : null;

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-dark-900 text-warm-800 dark:text-dark-100 transition-colors">
      <header className="flex items-center justify-between px-4 sm:px-10 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] border-b bg-white dark:bg-dark-800 border-warm-200 dark:border-dark-600">
        <a href="/" className="flex items-center gap-2 sm:gap-2.5 -ml-1.5 px-1.5 py-1 rounded-lg hover:opacity-80 transition-opacity">
          <LockIcon className="w-6 h-6 shrink-0" stroke="#C3B1E1" />
          <span className="text-[17px] sm:text-[19px] font-bold tracking-tight">Prompt Vault</span>
        </a>
        <button
          onClick={onToggleTheme}
          className="w-[38px] h-[38px] rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 flex items-center justify-center text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </button>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {state.status === 'loading' && (
          <div className="flex justify-center py-24" role="status" aria-label="Cargando">
            <div className="w-9 h-9 rounded-full border-[3px] border-lavender/30 border-t-lavender animate-spin" />
          </div>
        )}

        {(state.status === 'missing' || state.status === 'error') && (
          <div className="text-center py-20">
            <h1 className="text-[20px] font-bold mb-2">
              {state.status === 'missing' ? 'Este enlace no está disponible' : 'No se pudo cargar'}
            </h1>
            <p className="text-[15px] text-warm-500 dark:text-dark-300 mb-6">
              {state.status === 'missing'
                ? 'Puede que el enlace sea incorrecto o que quien lo compartió lo haya desactivado.'
                : 'Revisa tu conexión y vuelve a intentarlo.'}
            </p>
            <a href="/" className="inline-flex px-6 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition">
              Ir a Prompt Vault
            </a>
          </div>
        )}

        {state.status === 'ok' && (
          <article className="bg-white dark:bg-dark-800 border border-warm-200 dark:border-dark-600 rounded-2xl p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {item.type_name && (
                <span
                  style={softVars(typeColor)}
                  className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[10px] border text-[11px] font-semibold uppercase tracking-wide bg-(--soft-bg) border-(--soft-border) text-(--soft-text) dark:bg-(--soft-bg-dark) dark:text-(--soft-text-dark)"
                >
                  {item.type_id === 'skill' && <BoltIcon />}
                  {item.type_name}
                </span>
              )}
              {category && (
                <span className="px-2.5 py-1 rounded-[10px] text-xs font-medium" style={{ background: category.bg, color: category.text }}>
                  {item.category}
                </span>
              )}
            </div>
            <h1 className="text-[19px] sm:text-[22px] font-bold leading-snug mb-5 break-words">{item.title}</h1>
            <div className="bg-warm-50 dark:bg-dark-700 border border-warm-200 dark:border-dark-500 rounded-xl p-3.5 sm:p-4 mb-5">
              <pre className="font-mono text-[13px] leading-relaxed text-warm-700 dark:text-dark-200 whitespace-pre-wrap break-words m-0">
                {item.text}
              </pre>
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
            >
              {copied ? <><CheckIcon className="w-4 h-4" /> Copiado</> : <><CopyIcon /> Copiar al portapapeles</>}
            </button>
          </article>
        )}

        {state.status === 'ok' && (
          <p className="text-center text-[13px] text-warm-500 dark:text-dark-300 mt-6">
            Compartido con Prompt Vault.{' '}
            <a href="/" className="font-semibold text-[#5B4682] dark:text-lavender hover:underline">Crea tu propia bóveda</a>
          </p>
        )}
      </main>
    </div>
  );
}
