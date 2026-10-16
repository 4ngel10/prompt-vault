import { BoltIcon } from './Icons';
import SegmentedControl from './SegmentedControl';
import { usePreferences } from '../contexts/PreferencesContext';

export default function TypeFilter({ value, onChange }) {
  const { getTypeColors } = usePreferences();
  // "Todos" mantiene el lavanda de marca; cada tipo usa su color personalizable
  const options = [
    { value: 'all', label: 'Todos' },
    { value: 'prompt', label: 'Prompts', activeColor: getTypeColors('prompt').swatch },
    { value: 'skill', label: 'Skills', icon: <BoltIcon />, activeColor: getTypeColors('skill').swatch },
  ];
  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={onChange}
      label="Filtrar por tipo"
      className="w-full sm:w-auto mb-4 sm:mb-5"
    />
  );
}
