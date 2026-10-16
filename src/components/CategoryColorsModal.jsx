import Modal from './Modal';
import { CheckIcon } from './Icons';
import { COLOR_PALETTE } from '../constants';
import { useCategoryColors } from '../contexts/CategoryColorsContext';

const PALETTE_KEYS = Object.keys(COLOR_PALETTE);

function friendlyError(msg) {
  if (/user_preferences|PGRST205|does not exist/i.test(msg)) {
    return 'No se pudieron guardar los colores en tu cuenta porque falta la tabla de preferencias en Supabase. Se aplican ahora, pero se perderán al recargar.';
  }
  return `No se pudieron guardar los colores: ${msg}`;
}

export default function CategoryColorsModal({ open, onClose, categories, dark }) {
  const { getColors, getKey, setCategoryColor, resetColors, hasCustomColors, error } = useCategoryColors();

  return (
    <Modal open={open} onClose={onClose} title="Personalizar colores" width="max-w-lg">
      <p className="text-[13px] text-warm-500 dark:text-dark-300 leading-relaxed -mt-2 mb-4">
        Elige el color de cada categoría. Se usa en los filtros, en las tarjetas y en el formulario.
      </p>

      {categories.length === 0 ? (
        <p className="text-[13px] text-warm-400 dark:text-dark-400 py-6 text-center">
          Aún no tienes categorías. Créalas desde "Editar" en los filtros.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-warm-200 dark:divide-dark-500 border-y border-warm-200 dark:border-dark-500 max-h-[55dvh] overflow-y-auto overscroll-contain -mx-1 px-1">
          {categories.map(cat => {
            const current = getKey(cat);
            const scheme = dark ? getColors(cat).dark : getColors(cat).light;
            return (
              <li key={cat} className="py-3.5 flex flex-col gap-2.5">
                <span
                  className="self-start max-w-full truncate px-2.5 py-1 rounded-[10px] text-xs font-medium transition-colors"
                  style={{ background: scheme.bg, color: scheme.text }}
                >
                  {cat}
                </span>
                <div role="radiogroup" aria-label={`Color de ${cat}`} className="flex flex-wrap gap-2">
                  {PALETTE_KEYS.map(key => {
                    const color = COLOR_PALETTE[key];
                    const selected = key === current;
                    const ring = dark ? color.swatch : color.light.text;
                    const offset = dark ? '#252540' : '#FFFFFF';
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={color.label}
                        title={color.label}
                        onClick={() => setCategoryColor(cat, key)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 ease-out hover:scale-110 outline-none focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-warm-500 dark:focus-visible:outline-dark-200 cursor-pointer"
                        style={{
                          background: color.swatch,
                          color: color.light.text,
                          boxShadow: selected
                            ? `0 0 0 2px ${offset}, 0 0 0 4px ${ring}`
                            : `inset 0 0 0 1px rgba(0,0,0,${dark ? 0.2 : 0.06})`,
                        }}
                      >
                        {selected && <CheckIcon className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p role="alert" className="mt-4 text-[13px] leading-snug text-danger bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-[10px] px-3.5 py-2.5">
          {friendlyError(error)}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2.5 mt-5">
        <button
          type="button"
          onClick={resetColors}
          disabled={!hasCustomColors}
          className="px-5 py-2.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-warm-500 dark:text-dark-200 text-sm font-medium hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Restaurar por defecto
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
        >
          Listo
        </button>
      </div>
    </Modal>
  );
}
