import { useState } from 'react';
import { getItemType } from '../constants';
import { useCategoryColors } from '../contexts/CategoryColorsContext';
import TypeBadge from './TypeBadge';
import SharedBadge from './SharedBadge';
import { CopyIcon, EditIcon, TrashIcon, CheckIcon } from './Icons';
import Modal from './Modal';

export default function PromptDetail({ prompt, dark, onClose, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const { getColors } = useCategoryColors();

  if (!prompt) return null;

  const colors = getColors(prompt.category);
  const scheme = dark ? colors.dark : colors.light;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <Modal open={!!prompt} onClose={onClose} title="" width="max-w-xl">
      <div className="-mt-6">
        <div className="flex flex-col gap-2.5 mb-5">
          <h2 className="text-[17px] sm:text-[19px] font-bold leading-snug pr-10 break-words text-warm-800 dark:text-dark-100">
            {prompt.title}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            <TypeBadge type={getItemType(prompt)} />
            <span
              className="px-2.5 py-1 rounded-[10px] text-xs font-medium"
              style={{ background: scheme.bg, color: scheme.text }}
            >
              {prompt.category || 'Sin categoría'}
            </span>
            <SharedBadge item={prompt} />
          </div>
        </div>

        <div className="bg-warm-50 dark:bg-dark-700 border border-warm-200 dark:border-dark-500 rounded-xl p-3.5 sm:p-4 mb-5 max-h-[45dvh] overflow-y-auto">
          <pre className="font-mono text-[13px] leading-relaxed text-warm-700 dark:text-dark-200 whitespace-pre-wrap break-words m-0">
            {prompt.text}
          </pre>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-warm-600 dark:text-dark-200 text-sm font-medium hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer mb-5"
        >
          {copied ? <><CheckIcon className="w-4 h-4 text-mint" /> Copiado</> : <><CopyIcon /> Copiar al portapapeles</>}
        </button>

        {prompt.isOwn && <div className="flex gap-2.5 border-t border-warm-200 dark:border-dark-500 pt-4">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-warm-600 dark:text-dark-200 text-[13px] font-medium hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          >
            <EditIcon /> Editar
          </button>
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-danger text-[13px] font-medium hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <TrashIcon /> Eliminar
          </button>
        </div>}
      </div>
    </Modal>
  );
}
