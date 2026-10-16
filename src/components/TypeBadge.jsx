import { BoltIcon } from './Icons';
import { ITEM_TYPES } from '../constants';

const STYLES = {
  prompt: 'bg-lavender/20 border-lavender/60 text-[#5B4682] dark:bg-lavender/15 dark:text-lavender',
  skill:  'bg-mint/25 border-mint/70 text-[#2E6644] dark:bg-mint/15 dark:text-mint',
};

export default function TypeBadge({ type }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-[10px] border text-[11px] font-semibold uppercase tracking-wide ${STYLES[type]}`}>
      {type === 'skill' && <BoltIcon />}
      {ITEM_TYPES[type].label}
    </span>
  );
}
