import { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className={`bg-white dark:bg-dark-700 rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-7 w-full ${width} max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl animate-in`}>
        <div className="flex justify-between items-center mb-5 sm:mb-6">
          <h2 className="text-lg font-bold text-warm-800 dark:text-dark-100">{title}</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 sm:w-8 sm:h-8 -mr-1.5 sm:mr-0 shrink-0 rounded-lg bg-warm-100 dark:bg-dark-600 flex items-center justify-center text-warm-500 dark:text-dark-300 hover:bg-warm-200 dark:hover:bg-dark-500 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
