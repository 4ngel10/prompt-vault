import { ShareIcon } from './Icons';

// Ajenos: "Compartido por email". Propios compartidos: "Compartido".
export default function SharedBadge({ item }) {
  if (item.isOwn && !item.is_shared) return null;
  const label = item.isOwn ? 'Compartido' : `Compartido por ${item.owner_email ?? 'otro usuario'}`;
  return (
    <span
      title={label}
      className="inline-flex items-center gap-1 max-w-full px-2 py-[3px] rounded-[10px] border border-sky/70 bg-sky/20 dark:bg-sky/10 text-[11px] font-medium text-[#3A5F82] dark:text-sky"
    >
      <ShareIcon className="w-3 h-3 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}
