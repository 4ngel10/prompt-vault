import { useState } from 'react';
import { PlusIcon, TrashIcon } from './Icons';
import Modal from './Modal';

export default function CategoryManager({ open, onClose, categories, prompts, onAdd, onDelete }) {
  const [name, setName] = useState('');
  const [confirming, setConfirming] = useState(null);

  const trimmed = name.trim();
  const exists = categories.some(c => c.toLowerCase() === trimmed.toLowerCase()) || trimmed.toLowerCase() === 'todos';
  const canAdd = trimmed && !exists;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd(trimmed);
    setName('');
  };

  const handleClose = () => {
    setName('');
    setConfirming(null);
    onClose();
  };

  const countFor = (cat) => prompts.filter(p => p.category === cat).length;

  return (
    <Modal open={open} onClose={handleClose} title="Categorías" width="max-w-md">
      <div className="flex gap-2 mb-1.5">
        <input
          type="text"
          placeholder="Nueva categoría..."
          value={name}
          maxLength={30}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          className="flex-1 min-w-0 py-2.5 px-3.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 placeholder:text-warm-400 dark:placeholder:text-dark-400 outline-none focus:border-lavender transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <PlusIcon /> Añadir
        </button>
      </div>
      <p className="h-5 text-[12px] text-danger">{trimmed && exists ? 'Esa categoría ya existe.' : ''}</p>

      <ul className="flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto -mx-1 px-1">
        {categories.length === 0 && (
          <li className="text-[13px] text-warm-400 dark:text-dark-400 py-4 text-center">No hay categorías.</li>
        )}
        {categories.map(cat => {
          const count = countFor(cat);
          const isConfirming = confirming === cat;
          return (
            <li
              key={cat}
              className="flex items-center justify-between gap-3 py-2 px-3 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-800"
            >
              {isConfirming ? (
                <>
                  <span className="text-[13px] text-warm-600 dark:text-dark-200 leading-snug">
                    ¿Eliminar <b>{cat}</b>?{count > 0 && ` ${count} elemento${count > 1 ? 's quedarán' : ' quedará'} sin categoría.`}
                  </span>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setConfirming(null)}
                      className="px-3 py-1.5 rounded-lg text-[13px] text-warm-500 dark:text-dark-300 hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
                    >
                      No
                    </button>
                    <button
                      onClick={() => { onDelete(cat); setConfirming(null); }}
                      className="px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-danger text-white hover:brightness-90 transition cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm text-warm-800 dark:text-dark-100 truncate">
                    {cat}
                    <span className="ml-2 text-[12px] text-warm-400 dark:text-dark-400">{count}</span>
                  </span>
                  <button
                    onClick={() => setConfirming(cat)}
                    className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-warm-400 dark:text-dark-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    aria-label={`Eliminar categoría ${cat}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
