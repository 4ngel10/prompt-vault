import { BoltIcon, EditIcon } from './Icons';
import SegmentedControl from './SegmentedControl';
import { typeLabels } from '../constants';
import { usePreferences } from '../contexts/PreferencesContext';

export default function TypeFilter({ value, onChange, onManage }) {
  const { types, getTypeColors } = usePreferences();
  // "Todos" mantiene el lavanda de marca; cada tipo usa su color personalizable
  const options = [
    { value: 'all', label: 'Todos' },
    ...types.map(t => ({
      value: t.id,
      label: typeLabels(t).plural,
      icon: t.id === 'skill' ? <BoltIcon /> : null,
      activeColor: getTypeColors(t.id).swatch,
    })),
  ];
  return (
    <div className="flex items-center gap-2 mb-4 sm:mb-5 min-w-0">
      <SegmentedControl
        options={options}
        value={value}
        onChange={onChange}
        label="Filtrar por tipo"
        className="flex-1 sm:flex-none min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      />
      <button
        onClick={onManage}
        className="shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-dashed border-warm-200 dark:border-dark-500 text-warm-500 dark:text-dark-300 hover:border-lavender hover:text-warm-800 dark:hover:text-dark-100 transition-colors cursor-pointer"
        aria-label="Editar tipos"
      >
        <EditIcon /> Editar
      </button>
    </div>
  );
}
