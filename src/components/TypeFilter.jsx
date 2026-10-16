import { BoltIcon } from './Icons';
import SegmentedControl from './SegmentedControl';

const OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'prompt', label: 'Prompts' },
  { value: 'skill', label: 'Skills', icon: <BoltIcon />, activeClass: 'bg-mint' },
];

export default function TypeFilter({ value, onChange }) {
  return (
    <SegmentedControl
      options={OPTIONS}
      value={value}
      onChange={onChange}
      label="Filtrar por tipo"
      className="w-full sm:w-auto mb-4 sm:mb-5"
    />
  );
}
