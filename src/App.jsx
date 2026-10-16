import { useState, useMemo } from 'react';
import { useTheme } from './hooks/useTheme';
import { useItems } from './hooks/useItems';
import { useAuth } from './contexts/AuthContext';
import { typeLabels } from './constants';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import CategoryChips from './components/CategoryChips';
import PromptCard from './components/PromptCard';
import EmptyState from './components/EmptyState';
import Modal from './components/Modal';
import PromptForm from './components/PromptForm';
import PromptDetail from './components/PromptDetail';
import DeleteConfirm from './components/DeleteConfirm';
import ListEditorModal from './components/ListEditorModal';
import TypeBadge from './components/TypeBadge';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';
import { CloseIcon } from './components/Icons';

function App() {
  const [dark, toggleTheme] = useTheme();
  const { user } = useAuth();

  if (!user) return <AuthScreen dark={dark} onToggleTheme={toggleTheme} />;
  return (
    <PreferencesProvider key={user.id} user={user}>
      <Vault user={user} dark={dark} toggleTheme={toggleTheme} />
    </PreferencesProvider>
  );
}

function Vault({ user, dark, toggleTheme }) {
  const { signOut } = useAuth();
  const { items: prompts, loading, error, dismissError, createItem, updateItem, deleteItem, toggleShare, clearCategory, renameCategory, reassignType } = useItems(user);
  const prefs = usePreferences();
  const { categories, types, resolveType } = prefs;
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [formType, setFormType] = useState('prompt');
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingPrompt, setViewingPrompt] = useState(null);
  const [deletingPrompt, setDeletingPrompt] = useState(null);
  const [editingCategories, setEditingCategories] = useState(false);
  const [editingTypes, setEditingTypes] = useState(false);

  // Nº de items propios por categoría y por tipo, para los editores
  const [categoryCounts, typeCounts] = useMemo(() => {
    const byCategory = {};
    const byType = {};
    for (const p of prompts) {
      if (!p.isOwn) continue;
      if (p.category) byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
      const id = resolveType(p).id;
      byType[id] = (byType[id] ?? 0) + 1;
    }
    return [byCategory, byType];
  }, [prompts, resolveType]);

  // Si el tipo del filtro desaparece (eliminado), se vuelve a "Todos"
  const currentType = activeType === 'all' || types.some(t => t.id === activeType) ? activeType : 'all';
  const formTypeObj = types.find(t => t.id === formType) ?? types[0];

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      const matchesType = currentType === 'all' || resolveType(p).id === currentType;
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.text.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [prompts, currentType, resolveType, activeCategory, search]);

  const goHome = () => {
    setSearch('');
    setActiveType('all');
    setActiveCategory('Todos');
  };

  const openCreate = (type) => {
    setFormType(type);
    setCreateOpen(true);
  };

  const openEdit = (item) => {
    const type = resolveType(item);
    setFormType(type.unknown ? types[0].id : type.id);
    setEditingPrompt(item);
  };

  // Si Supabase falla, useItems muestra el aviso y el modal sigue abierto para reintentar
  const handleCreate = async (data) => {
    try {
      await createItem(data);
      setCreateOpen(false);
    } catch { /* aviso visible */ }
  };

  const handleEdit = async (data) => {
    try {
      await updateItem(editingPrompt.id, data);
      setEditingPrompt(null);
      setViewingPrompt(null);
    } catch { /* aviso visible */ }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(deletingPrompt.id);
      setDeletingPrompt(null);
      setViewingPrompt(null);
    } catch { /* aviso visible */ }
  };

  const handleToggleShare = async (item) => {
    try { await toggleShare(item); } catch { /* aviso visible */ }
  };

  // Renombrar y eliminar tocan los items en Supabase y las preferencias; si falla, el modal lo muestra
  const handleRenameCategory = async (from, to) => {
    await renameCategory(from, to);
    prefs.renameCategory(from, to);
    if (activeCategory === from) setActiveCategory(to);
  };

  const handleDeleteCategory = async (name) => {
    await clearCategory(name);
    prefs.deleteCategory(name);
    if (activeCategory === name) setActiveCategory('Todos');
  };

  // Al eliminar un tipo, sus items pasan al primer tipo que quede
  const fallbackTypeFor = (id) => types.find(t => t.id !== id);
  const handleDeleteType = async (id) => {
    await reassignType(id, fallbackTypeFor(id).id);
    prefs.deleteType(id);
  };

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* la sesión local se limpia igualmente */ }
  };

  const emptyLabel = currentType === 'all' ? 'elementos' : typeLabels(types.find(t => t.id === currentType)).plural.toLowerCase();

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-900 text-warm-800 dark:text-dark-100 transition-colors">
      <Header
        dark={dark}
        onToggleTheme={toggleTheme}
        onNew={openCreate}
        onHome={goHome}
        user={user}
        onSignOut={handleSignOut}
      />

      <div className="max-w-[1160px] mx-auto px-4 sm:px-10 pt-5 sm:pt-7 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter value={currentType} onChange={setActiveType} onManage={() => setEditingTypes(true)} />
        <CategoryChips
          categories={categories}
          active={activeCategory}
          dark={dark}
          onSelect={setActiveCategory}
          onManage={() => setEditingCategories(true)}
        />

        {loading ? (
          <div className="flex justify-center py-24" role="status" aria-label="Cargando">
            <div className="w-9 h-9 rounded-full border-[3px] border-lavender/30 border-t-lavender animate-spin" />
          </div>
        ) : prompts.length === 0 ? (
          <EmptyState onNew={openCreate} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-400 dark:text-dark-400 text-[15px]">
              No se encontraron {emptyLabel} con esos filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(p => (
              <PromptCard
                key={p.id}
                prompt={p}
                dark={dark}
                onClick={() => setViewingPrompt(p)}
                onEdit={() => openEdit(p)}
                onDelete={() => setDeletingPrompt(p)}
                onToggleShare={() => handleToggleShare(p)}
              />
            ))}
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="fixed z-[60] left-4 right-4 sm:left-auto sm:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-sm flex items-start gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-dark-700 shadow-lg">
          <p className="flex-1 text-[13px] leading-snug text-danger">
            No se pudo completar la operación: {error}
          </p>
          <button onClick={dismissError} className="shrink-0 text-warm-400 dark:text-dark-400 hover:text-warm-700 dark:hover:text-dark-100 cursor-pointer" aria-label="Cerrar aviso">
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={typeLabels(formTypeObj).newTitle}>
        <PromptForm categories={categories} dark={dark} type={formTypeObj.id} onTypeChange={setFormType} onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editingPrompt} onClose={() => setEditingPrompt(null)} title={typeLabels(formTypeObj).editTitle}>
        <PromptForm categories={categories} dark={dark} initial={editingPrompt} type={formTypeObj.id} onTypeChange={setFormType} onSave={handleEdit} onCancel={() => setEditingPrompt(null)} />
      </Modal>

      {/* Detail view */}
      <PromptDetail
        prompt={viewingPrompt}
        dark={dark}
        onClose={() => setViewingPrompt(null)}
        onEdit={() => { openEdit(viewingPrompt); setViewingPrompt(null); }}
        onDelete={() => { setDeletingPrompt(viewingPrompt); }}
      />

      {/* Delete confirmation */}
      <DeleteConfirm
        open={!!deletingPrompt}
        type={deletingPrompt ? resolveType(deletingPrompt) : types[0]}
        onClose={() => setDeletingPrompt(null)}
        onConfirm={handleDelete}
      />

      {/* Category editor: add, rename, delete, reorder and color */}
      <ListEditorModal
        open={editingCategories}
        onClose={() => setEditingCategories(false)}
        title="Editar categorías"
        description="Arrastra para cambiar el orden. El color se usa en los filtros, las tarjetas y el formulario."
        dark={dark}
        entries={categories.map(c => ({ id: c, label: c }))}
        counts={categoryCounts}
        renderPreview={({ label }) => {
          const scheme = dark ? prefs.getColors(label).dark : prefs.getColors(label).light;
          return (
            <span className="min-w-0 truncate px-2.5 py-1 rounded-[10px] text-xs font-medium" style={{ background: scheme.bg, color: scheme.text }}>
              {label}
            </span>
          );
        }}
        colorKey={prefs.getKey}
        onPickColor={prefs.setCategoryColor}
        onAdd={prefs.addCategory}
        onRename={handleRenameCategory}
        onDelete={handleDeleteCategory}
        onReorder={prefs.reorderCategories}
        deleteNotice={(_, n) => `${n} elemento${n > 1 ? 's quedarán' : ' quedará'} sin categoría.`}
        addPlaceholder="Nueva categoría..."
        emptyText="No hay categorías."
        canReset={prefs.hasCustomCategoryColors}
        onReset={prefs.resetCategoryColors}
        error={prefs.error}
      />

      {/* Type editor: same options; at least one type must remain */}
      <ListEditorModal
        open={editingTypes}
        onClose={() => setEditingTypes(false)}
        title="Editar tipos"
        description="Arrastra para cambiar el orden. El color se usa en los filtros, las badges y el formulario."
        dark={dark}
        entries={types.map(t => ({ id: t.id, label: t.name }))}
        counts={typeCounts}
        renderPreview={({ id }) => <TypeBadge type={types.find(t => t.id === id)} />}
        colorKey={prefs.getTypeKey}
        onPickColor={prefs.setTypeColor}
        onAdd={prefs.addType}
        onRename={prefs.renameType}
        onDelete={handleDeleteType}
        onReorder={prefs.reorderTypes}
        deleteNotice={({ id }, n) => `${n} elemento${n > 1 ? 's pasarán' : ' pasará'} a «${fallbackTypeFor(id)?.name}».`}
        minEntries={1}
        addPlaceholder="Nuevo tipo..."
        emptyText="No hay tipos."
        canReset={prefs.hasCustomTypeColors}
        onReset={prefs.resetTypeColors}
        error={prefs.error}
      />
    </div>
  );
}

export default App;
