import { useState } from 'react';
import Modal from './Modal';
import { CheckIcon, CloseIcon, CopyIcon, LinkIcon, PlusIcon } from './Icons';
import { shareUrl } from '../constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = 'flex-1 min-w-0 py-2 px-3 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 placeholder:text-warm-400 dark:placeholder:text-dark-400 outline-none focus:border-lavender transition-colors';
const sectionTitleClass = 'text-[11px] font-semibold uppercase tracking-wide text-warm-500 dark:text-dark-300 mb-1';
const hintClass = 'text-[13px] text-warm-500 dark:text-dark-300 leading-relaxed mb-3';
const secondaryButtonClass = 'flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-warm-600 dark:text-dark-200 text-sm font-medium hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-50 cursor-pointer';

export default function ShareDialog({ item, userEmail, onClose, onAddShare, onRemoveShare, onSetLink }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!item) return null;
  const shares = item.shares ?? [];
  const link = item.share_token ? shareUrl(item.share_token) : null;

  const withBusy = async (fn) => {
    setBusy(true);
    try { await fn(); } catch { /* el aviso de la app muestra el error */ } finally { setBusy(false); }
  };

  const handleAdd = () => {
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) { setEmailError('Escribe un email válido.'); return; }
    if (value === userEmail?.toLowerCase()) { setEmailError('Ese es tu propio email.'); return; }
    if (shares.includes(value)) { setEmailError('Ya está compartido con esa persona.'); return; }
    withBusy(async () => {
      await onAddShare(value);
      setEmail(''); setEmailError('');
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* el usuario puede copiarlo a mano del campo */ }
  };

  const handleClose = () => {
    setEmail(''); setEmailError(''); setCopied(false);
    onClose();
  };

  return (
    <Modal open onClose={handleClose} title="Compartir" width="max-w-lg">
      <p className="text-[14px] font-semibold text-warm-800 dark:text-dark-100 -mt-3 mb-5 truncate" title={item.title}>
        {item.title}
      </p>

      <section aria-labelledby="share-people" className="mb-6">
        <h3 id="share-people" className={sectionTitleClass}>Con personas</h3>
        <p className={hintClass}>
          Solo estas personas lo verán en su bóveda al iniciar sesión con ese email. Podrán copiarlo, pero no editarlo.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            inputMode="email"
            autoComplete="off"
            placeholder="email@ejemplo.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            aria-label="Email de la persona"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!email.trim() || busy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <PlusIcon /> Añadir
          </button>
        </div>
        <p className="min-h-5 mt-1 text-[12px] text-danger" role="status">{emailError}</p>

        {shares.length > 0 ? (
          <ul className="flex flex-col divide-y divide-warm-200 dark:divide-dark-500 border-y border-warm-200 dark:border-dark-500">
            {shares.map(e => (
              <li key={e} className="flex items-center gap-2.5 py-2">
                <span aria-hidden="true" className="w-7 h-7 shrink-0 rounded-full bg-sky/30 text-[#3A5F82] dark:text-sky text-[12px] font-bold flex items-center justify-center uppercase">
                  {e[0]}
                </span>
                <span className="flex-1 min-w-0 truncate text-sm text-warm-700 dark:text-dark-100" title={e}>{e}</span>
                <button
                  type="button"
                  onClick={() => withBusy(() => onRemoveShare(e))}
                  disabled={busy}
                  aria-label={`Quitar acceso a ${e}`}
                  title="Quitar acceso"
                  className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-warm-400 dark:text-dark-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-warm-400 dark:text-dark-400">Aún no lo has compartido con nadie.</p>
        )}
      </section>

      <section aria-labelledby="share-link">
        <h3 id="share-link" className={sectionTitleClass}>Enlace público</h3>
        {link ? (
          <>
            <p className={hintClass}>Cualquiera con este enlace puede verlo y copiarlo, sin necesidad de cuenta.</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={link}
                onFocus={e => e.target.select()}
                aria-label="Enlace público"
                className={`${inputClass} font-mono text-[13px]`}
              />
              <button type="button" onClick={handleCopy} className={secondaryButtonClass}>
                {copied ? <><CheckIcon className="w-4 h-4 text-[#2E6644] dark:text-mint" /> Copiado</> : <><CopyIcon /> Copiar</>}
              </button>
            </div>
            <button
              type="button"
              onClick={() => withBusy(() => onSetLink(false))}
              disabled={busy}
              className="mt-3 text-[13px] font-medium text-danger hover:underline disabled:opacity-50 cursor-pointer"
            >
              Desactivar enlace
            </button>
            <p className="mt-1 text-[12px] text-warm-400 dark:text-dark-400">Si lo desactivas, el enlace deja de funcionar. Uno nuevo tendrá otra dirección.</p>
          </>
        ) : (
          <>
            <p className={hintClass}>Crea un enlace de solo lectura para compartirlo con quien quieras, aunque no tenga cuenta.</p>
            <button type="button" onClick={() => withBusy(() => onSetLink(true))} disabled={busy} className={secondaryButtonClass}>
              <LinkIcon /> Crear enlace
            </button>
          </>
        )}
      </section>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleClose}
          className="px-6 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
        >
          Listo
        </button>
      </div>
    </Modal>
  );
}
