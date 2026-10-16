import { LinkIcon, ShareIcon } from './Icons';

// Propios: con cuántas personas y/o si hay enlace público. Ajenos: quién te lo ha compartido.
export function sharingSummary(item) {
  if (!item.isOwn) return `Compartido por ${item.owner_email ?? 'otro usuario'}`;
  const n = item.shares?.length ?? 0;
  const people = n > 0 ? `Compartido con ${n} ${n === 1 ? 'persona' : 'personas'}` : null;
  if (people && item.share_token) return `${people} · enlace`;
  if (people) return people;
  if (item.share_token) return 'Enlace público';
  return null;
}

export default function SharedBadge({ item }) {
  const label = sharingSummary(item);
  if (!label) return null;
  const Icon = item.isOwn && !item.shares?.length ? LinkIcon : ShareIcon;
  return (
    <span
      title={label}
      className="inline-flex items-center gap-1 max-w-full px-2 py-[3px] rounded-[10px] border border-sky/70 bg-sky/20 dark:bg-sky/10 text-[11px] font-medium text-[#3A5F82] dark:text-sky"
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}
