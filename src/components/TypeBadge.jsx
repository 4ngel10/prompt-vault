import { BoltIcon } from './Icons';
import { ITEM_TYPES, softVars } from '../constants';
import { usePreferences } from '../contexts/PreferencesContext';

export default function TypeBadge({ type }) {
  const { getTypeColors } = usePreferences();
  return (
    <span
      style={softVars(getTypeColors(type))}
      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[10px] border text-[11px] font-semibold uppercase tracking-wide bg-(--soft-bg) border-(--soft-border) text-(--soft-text) dark:bg-(--soft-bg-dark) dark:text-(--soft-text-dark)"
    >
      {type === 'skill' && <BoltIcon />}
      {ITEM_TYPES[type].label}
    </span>
  );
}
