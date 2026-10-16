import { useState, useEffect } from 'react';
import { ChevronDownIcon, BoltIcon } from './Icons';
import { typeLabels } from '../constants';
import { usePreferences } from '../contexts/PreferencesContext';
import SegmentedControl from './SegmentedControl';

// Las opciones del desplegable mantienen colores neutros aunque el select esté tintado
const OPTION_CLASS = 'bg-white text-warm-800 dark:bg-dark-700 dark:text-dark-100';

export default function PromptForm({ categories, initial, type, dark, onTypeChange, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const { getColors, getTypeColors, types } = usePreferences();
  const typeOptions = types.map(t => ({
    value: t.id,
    label: t.name,
    icon: t.id === 'skill' ? <BoltIcon /> : null,
    activeColor: getTypeColors(t.id).swatch,
  }));
  const labels = typeLabels(types.find(t => t.id === type) ?? types[0]);
  const categoryColors = category ? getColors(category) : null;
  const scheme = categoryColors ? (dark ? categoryColors.dark : categoryColors.light) : null;

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setCategory(initial.category);
      setText(initial.text);
    } else {
      setTitle('');
      setCategory('');
      setText('');
    }
  }, [initial]);

  const handleSubmit = () => {
    if (!title.trim() || !category || !text.trim()) return;
    onSave({ title: title.trim(), category, text: text.trim(), type });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-[13px] font-semibold text-warm-600 dark:text-dark-300 mb-1.5">
          Tipo
        </label>
        <SegmentedControl
          options={typeOptions}
          value={type}
          onChange={onTypeChange}
          label="Tipo"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-warm-600 dark:text-dark-300 mb-1.5">
          Título
        </label>
        <input
          type="text"
          placeholder="Ej: Analizar código Python"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full py-2.5 px-3.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 placeholder:text-warm-400 dark:placeholder:text-dark-400 outline-none focus:border-lavender transition-colors"
        />
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-warm-600 dark:text-dark-300 mb-1.5">
          Categoría
        </label>
        <div className="relative">
          {/* El select nativo no permite colorear opciones: el campo adopta el color de la categoría elegida */}
          {scheme && (
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full pointer-events-none"
              style={{ background: categoryColors.swatch }}
            />
          )}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={scheme ? { background: scheme.bg, color: scheme.text, borderColor: scheme.border } : undefined}
            className={`w-full py-2.5 pr-3.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 outline-none appearance-none cursor-pointer focus:border-lavender transition-colors ${scheme ? 'pl-8 font-medium' : 'pl-3.5'}`}
          >
            <option value="" className={OPTION_CLASS}>Seleccionar categoría...</option>
            {categories.map(c => (
              <option key={c} value={c} className={OPTION_CLASS}>{c}</option>
            ))}
          </select>
          <span
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex text-warm-400 dark:text-dark-400 pointer-events-none"
            style={scheme ? { color: scheme.text } : undefined}
          >
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-warm-600 dark:text-dark-300 mb-1.5">
          {labels.name}
        </label>
        <textarea
          placeholder={labels.placeholder}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
          className="w-full py-3 px-3.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 font-mono text-base sm:text-[13px] text-warm-800 dark:text-dark-100 placeholder:text-warm-400 dark:placeholder:text-dark-400 outline-none resize-y leading-relaxed focus:border-lavender transition-colors"
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-2">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-warm-500 dark:text-dark-200 text-sm font-medium hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !category || !text.trim()}
          className="px-6 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
