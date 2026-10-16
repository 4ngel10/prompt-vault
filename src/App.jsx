import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useItems } from './hooks/useItems';
import { useAuth } from './contexts/AuthContext';
import { CATEGORIES, ITEM_TYPES, getItemType } from './constants';
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
import CategoryManager from './components/CategoryManager';
import { CloseIcon } from './components/Icons';

function App() {
  const [dark, toggleTheme] = useTheme();
  const { user } = useAuth();

  if (!user) return <AuthScreen dark={dark} onToggleTheme={toggleTheme} />;
  return <Vault key={user.id} user={user} dark={dark} toggleTheme={toggleTheme} />;
}

function Vault({ user, dark, toggleTheme }) {
  const { signOut } = useAuth();
  const { items: prompts, loading, error, dismissError, createItem, updateItem, deleteItem, toggleShare, clearCategory } = useItems(user);
  const [categories, setCategories] = useLocalStorage('pv-categories', CATEGORIES);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [formType, setFormType] = useState('prompt');
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingPrompt, setViewingPrompt] = useState(null);
  const [deletingPrompt, setDeletingPrompt] = useState(null);
  const [managingCategories, setManagingCategories] = useState(false);

  const ownPrompts = useMemo(() => prompts.filter(p => p.isOwn), [prompts]);

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      const matchesType = activeType === 'all' || getItemType(p) === activeType;
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.text.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [prompts, activeType, activeCategory, search]);

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
    setFormType(getItemType(item));
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

  const handleAddCategory = (name) => {
    setCategories(prev => [...prev, name]);
  };

  const handleDeleteCategory = async (name) => {
    try {
      await clearCategory(name);
      setCategories(prev => prev.filter(c => c !== name));
      if (activeCategory === name) setActiveCategory('Todos');
    } catch { /* aviso visible */ }
  };

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* la sesión local se limpia igualmente */ }
  };

  const emptyLabel = activeType === 'all' ? 'elementos' : ITEM_TYPES[activeType].plural.toLowerCase();

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
        <TypeFilter value={activeType} onChange={setActiveType} />
        <CategoryChips
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
          onManage={() => setManagingCategories(true)}
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
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={ITEM_TYPES[formType].newTitle}>
        <PromptForm categories={categories} type={formType} onTypeChange={setFormType} onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editingPrompt} onClose={() => setEditingPrompt(null)} title={ITEM_TYPES[formType].editTitle}>
        <PromptForm categories={categories} initial={editingPrompt} type={formType} onTypeChange={setFormType} onSave={handleEdit} onCancel={() => setEditingPrompt(null)} />
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
        type={getItemType(deletingPrompt)}
        onClose={() => setDeletingPrompt(null)}
        onConfirm={handleDelete}
      />

      {/* Category manager */}
      <CategoryManager
        open={managingCategories}
        onClose={() => setManagingCategories(false)}
        categories={categories}
        prompts={ownPrompts}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}

export default App;
