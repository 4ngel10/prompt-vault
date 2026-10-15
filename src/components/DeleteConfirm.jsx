import { TrashIcon } from './Icons';
import Modal from './Modal';

export default function DeleteConfirm({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="" width="max-w-sm">
      <div className="-mt-6 text-center sm:pt-0 pt-2">
        <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <TrashIcon className="w-5 h-5 text-danger" />
        </div>
        <h3 className="text-base font-bold text-warm-800 dark:text-dark-100 mb-2">
          ¿Eliminar este prompt?
        </h3>
        <p className="text-[13px] text-warm-500 dark:text-dark-300 leading-relaxed mb-6">
          Esta acción no se puede deshacer. El prompt será eliminado permanentemente de tu bóveda.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-warm-600 dark:text-dark-200 text-sm font-medium hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-[10px] bg-danger text-white text-sm font-semibold hover:brightness-90 transition cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}
