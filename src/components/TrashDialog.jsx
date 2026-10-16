import { useState } from 'react';
import Modal from './Modal';
import TypeBadge from './TypeBadge';
import { RestoreIcon, TrashIcon } from './Icons';
import { usePreferences } from '../contexts/PreferencesContext';
import { TRASH_DAYS } from '../hooks/useItems';

const iconButtonClass = 'w-11 h-11 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-warm-500 dark:text-dark-300 transition-colors disabled:opacity-40 cursor-pointer';

function daysLeft(deletedAt) {
  const left = TRASH_DAYS - Math.floor((Date.now() - new Date(deletedAt).getTime()) / 864e5);
  return Math.max(left, 0);
}

// Papelera: restaurar o borrar definitivamente. Lo que lleva más de TRASH_DAYS se borra solo.
export default function TrashDialog({ items, onClose, onRestore, onPurge, onEmpty }) {
  const { resolveType } = usePreferences();
  const [confirming, setConfirming] = useState(null); // id del item o 'all'
  const [busy, setBusy] = useState(false);

  const withBusy = async (fn) => {
    setBusy(true);
    try { await fn(); setConfirming(null); } catch { /* el aviso de la app muestra el error */ } finally { setBusy(false); }
  };

  return (
    <Modal open onClose={onClose} title="Papelera" width="max-w-lg">
      <p className="text-[13px] text-warm-500 dark:text-dark-300 leading-relaxed -mt-3 mb-5">
        Lo que eliminas se guarda aquí {TRASH_DAYS} días antes de borrarse definitivamente.
      </p>

      {items.length === 0 ? (
        <p className="text-[14px] text-warm-500 dark:text-dark-300 text-center py-10">La papelera está vacía.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-warm-200 dark:divide-dark-500 border-y border-warm-200 dark:border-dark-500">
          {items.map(item => {
            const left = daysLeft(item.deleted_at);
            return (
              <li key={item.id} className="py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-800 dark:text-dark-100 truncate" title={item.title}>{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TypeBadge type={resolveType(item)} />
                      <span className="text-[12px] text-warm-500 dark:text-dark-300">
                        {left === 0 ? 'Se borra hoy' : `Se borra en ${left} día${left > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => withBusy(() => onRestore(item.id))}
                    disabled={busy}
                    aria-label={`Restaurar ${item.title}`}
                    title="Restaurar"
                    className={`${iconButtonClass} hover:text-warm-800 dark:hover:text-dark-100 hover:bg-warm-100 dark:hover:bg-dark-600`}
                  >
                    <RestoreIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(item.id)}
                    disabled={busy}
                    aria-label={`Eliminar definitivamente ${item.title}`}
                    title="Eliminar definitivamente"
                    className={`${iconButtonClass} hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                {confirming === item.id && (
                  <div role="alert" className="flex flex-wrap items-center gap-2 mt-2 text-[13px]">
                    <span className="flex-1 min-w-[12rem] text-danger">¿Eliminar definitivamente? No se podrá recuperar.</span>
                    <button type="button" onClick={() => setConfirming(null)} className="px-3 py-2 rounded-lg font-medium text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 cursor-pointer">
                      Cancelar
                    </button>
                    <button type="button" onClick={() => withBusy(() => onPurge(item.id))} disabled={busy} className="px-3 py-2 rounded-lg font-semibold bg-danger text-white dark:text-dark-900 hover:brightness-90 disabled:opacity-50 cursor-pointer">
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {confirming === 'all' && (
        <p role="alert" className="mt-4 text-[13px] leading-snug text-danger">
          Se borrarán definitivamente {items.length} elemento{items.length > 1 ? 's' : ''}. No se podrán recuperar.
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2.5 mt-6">
        {items.length > 0 && (confirming === 'all' ? (
          <>
            <button type="button" onClick={() => setConfirming(null)} className="px-4 py-2.5 rounded-[10px] text-sm font-medium text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 cursor-pointer">
              Cancelar
            </button>
            <button type="button" onClick={() => withBusy(onEmpty)} disabled={busy} className="px-4 py-2.5 rounded-[10px] bg-danger text-white dark:text-dark-900 text-sm font-semibold hover:brightness-90 disabled:opacity-50 cursor-pointer">
              Vaciar papelera
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirming('all')} disabled={busy} className="mr-auto px-4 py-2.5 rounded-[10px] text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
            Vaciar papelera
          </button>
        ))}
        {confirming !== 'all' && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
          >
            Listo
          </button>
        )}
      </div>
    </Modal>
  );
}
