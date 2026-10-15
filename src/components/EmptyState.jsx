import { LockIcon, PlusIcon } from './Icons';

export default function EmptyState({ onNewPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#EDE7F6] via-[#F3E5F5] to-[#FCE4EC] dark:from-[#2a2545] dark:via-[#2e2540] dark:to-[#352535] flex items-center justify-center mb-7">
        <LockIcon className="w-[52px] h-[52px]" stroke="#C3B1E1" />
      </div>
      <h2 className="text-[22px] font-bold text-warm-800 dark:text-dark-100 mb-2.5">
        Tu bóveda está vacía
      </h2>
      <p className="text-[15px] text-warm-500 dark:text-dark-300 leading-relaxed max-w-[380px] mb-7">
        Empieza guardando tu primer prompt. Puedes copiarlos de foros, blogs o cualquier sitio web y organizarlos por categoría.
      </p>
      <button
        onClick={onNewPrompt}
        className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-lavender text-warm-800 dark:text-dark-900 text-[15px] font-semibold hover:brightness-95 transition cursor-pointer"
      >
        <PlusIcon className="w-[17px] h-[17px]" />
        Guardar mi primer prompt
      </button>
    </div>
  );
}
