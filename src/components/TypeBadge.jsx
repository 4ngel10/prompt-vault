import { BoltIcon } from './Icons';
import { softVars } from '../constants';
import { usePreferences } from '../contexts/PreferencesContext';

// `type` es un tipo resuelto ({ id, name }); los desconocidos se muestran en gris neutro
export default function TypeBadge({ type }) {
  const { getTypeColors } = usePreferences();
  return (
    <span
      style={softVars(getTypeColors(type.id))}
      className="inline-flex items-center gap-1 max-w-full px-2 py-[3px] rounded-[10px] border text-[11px] font-semibold uppercase tracking-wide bg-(--soft-bg) border-(--soft-border) text-(--soft-text) dark:bg-(--soft-bg-dark) dark:text-(--soft-text-dark)"
    >
      {type.id === 'skill' && <BoltIcon />}
      <span className="truncate">{type.name}</span>
    </span>
  );
}
