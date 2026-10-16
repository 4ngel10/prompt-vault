import { useRef, useState } from 'react';
import Modal from './Modal';
import { CheckIcon, ChevronDownIcon, EditIcon, GripIcon, PlusIcon, TrashIcon } from './Icons';
import { COLOR_PALETTE } from '../constants';

const PALETTE_KEYS = Object.keys(COLOR_PALETTE);
const MAX_NAME = 30;

const inputClass = 'flex-1 min-w-0 py-2 px-3 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 placeholder:text-warm-500 dark:placeholder:text-dark-300 outline-none focus:border-lavender transition-colors';
const iconButtonClass = 'w-11 h-11 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-warm-400 dark:text-dark-400 transition-colors cursor-pointer';

function validateName(name, entries, currentId) {
  const t = name.trim();
  if (!t) return 'Escribe un nombre.';
  if (t.toLowerCase() === 'todos') return '"Todos" está reservado.';
  if (entries.some(e => e.id !== currentId && e.label.toLowerCase() === t.toLowerCase())) return 'Ese nombre ya existe.';
  return null;
}

function friendlyError(msg) {
  if (/user_preferences|PGRST20[45]|42703|42P01|does not exist|column/i.test(msg)) {
    return 'No se pudieron guardar los cambios en tu cuenta: falta actualizar la base de datos en Supabase. Se aplican ahora, pero se perderán al recargar.';
  }
  return `No se pudieron guardar los cambios: ${msg}`;
}

function SwatchRow({ label, current, dark, onPick }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
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
            onClick={() => onPick(key)}
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
  );
}

/**
 * Editor de una lista ordenada con nombre y color por entrada (categorías, tipos).
 * entries: [{ id, label }] en orden. Las acciones async (onRename, onDelete) pueden lanzar para mostrar el error.
 */
export default function ListEditorModal({
  open, onClose, title, description, dark,
  entries, counts = {}, renderPreview, colorKey, onPickColor,
  onAdd, onRename, onDelete, onReorder, deleteNotice,
  minEntries = 0, addPlaceholder, emptyText,
  canReset, onReset, error,
}) {
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const [editError, setEditError] = useState('');
  const [confirming, setConfirming] = useState(null);
  const [busy, setBusy] = useState(false);

  // Arrastre: la fila es arrastrable pero solo arranca desde el asa; `preview` es el orden provisional (ids)
  const handleGrabbed = useRef(false);
  const [dragging, setDragging] = useState(null);
  const [preview, setPreview] = useState(null);
  const byId = Object.fromEntries(entries.map(e => [e.id, e]));
  const ids = entries.map(e => e.id);
  const list = (preview ?? ids).map(id => byId[id]).filter(Boolean);
  const canDelete = entries.length > minEntries;

  const handleClose = () => {
    setNewName(''); setAddError('');
    setEditing(null); setEditError('');
    setConfirming(null);
    onClose();
  };

  const handleAdd = () => {
    const err = validateName(newName, entries);
    if (err) { setAddError(newName.trim() ? err : ''); return; }
    onAdd(newName.trim());
    setNewName(''); setAddError('');
  };

  const startEdit = (entry) => {
    setConfirming(null);
    setEditing(entry.id); setDraft(entry.label); setEditError('');
  };

  const saveEdit = async () => {
    const to = draft.trim();
    if (to === byId[editing]?.label) { setEditing(null); return; }
    const err = validateName(to, entries, editing);
    if (err) { setEditError(err); return; }
    setBusy(true);
    try {
      await onRename(editing, to);
      setEditing(null);
    } catch {
      setEditError('No se pudo renombrar. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async (id) => {
    setBusy(true);
    try {
      await onDelete(id);
      setConfirming(null);
    } catch { /* el aviso de la app muestra el error */ } finally {
      setBusy(false);
    }
  };

  const move = (id, delta) => {
    const from = ids.indexOf(id);
    const to = from + delta;
    if (to < 0 || to >= ids.length) return;
    const next = [...ids];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onReorder(next);
  };

  const onDragStart = (e, id) => {
    if (!handleGrabbed.current) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDragging(id);
    setPreview(ids);
  };

  const onDragOver = (e, id) => {
    if (!dragging) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id === dragging) return;
    setPreview(prev => {
      const next = [...prev];
      const from = next.indexOf(dragging);
      const to = next.indexOf(id);
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  };

  const endDrag = () => {
    if (preview && preview.some((id, i) => id !== ids[i])) onReorder(preview);
    setPreview(null); setDragging(null);
    handleGrabbed.current = false;
  };

  return (
    <Modal open={open} onClose={handleClose} title={title} width="max-w-lg">
      {description && (
        <p className="text-[13px] text-warm-500 dark:text-dark-300 leading-relaxed -mt-2 mb-4">{description}</p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={addPlaceholder}
          value={newName}
          maxLength={MAX_NAME}
          onChange={e => { setNewName(e.target.value); setAddError(''); }}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          aria-label={addPlaceholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <PlusIcon /> Añadir
        </button>
      </div>
      <p className="min-h-5 mt-1 text-[12px] text-danger" role="status">{addError}</p>

      {list.length === 0 ? (
        <p className="text-[13px] text-warm-500 dark:text-dark-300 py-6 text-center">{emptyText}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-warm-200 dark:divide-dark-500 border-y border-warm-200 dark:border-dark-500">
          {list.map((entry, index) => {
            const { id, label } = entry;
            const count = counts[id] ?? 0;
            const isEditing = editing === id;
            const isConfirming = confirming === id;
            return (
              <li
                key={id}
                draggable={!isEditing}
                onDragStart={e => onDragStart(e, id)}
                onDragOver={e => onDragOver(e, id)}
                onDrop={e => e.preventDefault()}
                onDragEnd={endDrag}
                className={`py-3 flex flex-col gap-2.5 transition-opacity ${dragging === id ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    aria-label={`Mover ${label}. Usa las flechas arriba y abajo`}
                    title="Arrastra para reordenar"
                    onPointerDown={() => { handleGrabbed.current = true; }}
                    onPointerUp={() => { if (!dragging) handleGrabbed.current = false; }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowUp') { e.preventDefault(); move(id, -1); }
                      if (e.key === 'ArrowDown') { e.preventDefault(); move(id, 1); }
                    }}
                    className={`${iconButtonClass} -ml-1.5 cursor-grab active:cursor-grabbing hover:text-warm-700 dark:hover:text-dark-100 hover:bg-warm-50 dark:hover:bg-dark-600`}
                  >
                    <GripIcon />
                  </button>

                  {isEditing ? (
                    <>
                      <input
                        autoFocus
                        type="text"
                        value={draft}
                        maxLength={MAX_NAME}
                        onChange={e => { setDraft(e.target.value); setEditError(''); }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') { e.stopPropagation(); setEditing(null); }
                        }}
                        aria-label={`Nuevo nombre para ${label}`}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={busy}
                        aria-label="Guardar nombre"
                        className={`${iconButtonClass} text-[#2E6644] dark:text-mint hover:bg-mint/20 disabled:opacity-40`}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="min-w-0 flex">{renderPreview(entry)}</span>
                      <span className="shrink-0 text-[12px] text-warm-500 dark:text-dark-300 tabular-nums" title={`${count} elementos`}>
                        {count}
                      </span>
                      <span className="flex-1" />
                      <button
                        type="button"
                        onClick={() => move(id, -1)}
                        disabled={index === 0}
                        aria-label={`Subir ${label}`}
                        className={`${iconButtonClass} sm:hidden hover:bg-warm-50 dark:hover:bg-dark-600 disabled:opacity-30`}
                      >
                        <ChevronDownIcon className="w-3.5 h-3.5 rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(id, 1)}
                        disabled={index === list.length - 1}
                        aria-label={`Bajar ${label}`}
                        className={`${iconButtonClass} sm:hidden hover:bg-warm-50 dark:hover:bg-dark-600 disabled:opacity-30`}
                      >
                        <ChevronDownIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        aria-label={`Renombrar ${label}`}
                        title="Renombrar"
                        className={`${iconButtonClass} hover:text-warm-700 dark:hover:text-dark-100 hover:bg-warm-50 dark:hover:bg-dark-600`}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditing(null); setConfirming(id); }}
                        disabled={!canDelete}
                        aria-label={`Eliminar ${label}`}
                        title={canDelete ? 'Eliminar' : 'Tiene que quedar al menos uno'}
                        className={`${iconButtonClass} hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-warm-400`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {isEditing && editError && (
                  <p className="pl-8 -mt-1 text-[12px] text-danger" role="alert">{editError}</p>
                )}

                {isConfirming ? (
                  <div className="ml-8 flex items-center justify-between gap-3 px-3 py-2 rounded-[10px] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                    <span className="text-[13px] text-warm-600 dark:text-dark-200 leading-snug">
                      ¿Eliminar <b>{label}</b>?{count > 0 && ` ${deleteNotice(entry, count)}`}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setConfirming(null)}
                        className="px-3 py-1.5 rounded-lg text-[13px] text-warm-500 dark:text-dark-300 hover:bg-white dark:hover:bg-dark-600 transition-colors cursor-pointer"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(id)}
                        disabled={busy}
                        className="px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-danger text-white hover:brightness-90 transition disabled:opacity-50 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pl-8">
                    <SwatchRow
                      label={`Color de ${label}`}
                      current={colorKey(id)}
                      dark={dark}
                      onPick={key => onPickColor(id, key)}
                    />
                  </div>
                )}
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
          onClick={onReset}
          disabled={!canReset}
          className="px-5 py-2.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-warm-500 dark:text-dark-200 text-sm font-medium hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Restaurar colores
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="px-6 py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition cursor-pointer"
        >
          Listo
        </button>
      </div>
    </Modal>
  );
}
