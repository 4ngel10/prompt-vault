import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { SAMPLE_PROMPTS } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryChips from './components/CategoryChips';
import PromptCard from './components/PromptCard';
import EmptyState from './components/EmptyState';
import Modal from './components/Modal';
import PromptForm from './components/PromptForm';
import PromptDetail from './components/PromptDetail';
import DeleteConfirm from './components/DeleteConfirm';

function App() {
  const [dark, toggleTheme] = useTheme();
  const [prompts, setPrompts] = useLocalStorage('pv-prompts', SAMPLE_PROMPTS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingPrompt, setViewingPrompt] = useState(null);
  const [deletingPrompt, setDeletingPrompt] = useState(null);

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.text.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [prompts, activeCategory, search]);

  const handleCreate = (data) => {
    const newPrompt = { ...data, id: Date.now().toString() };
    setPrompts(prev => [newPrompt, ...prev]);
    setCreateOpen(false);
  };

  const handleEdit = (data) => {
    setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? { ...p, ...data } : p));
    setEditingPrompt(null);
    setViewingPrompt(null);
  };

  const handleDelete = () => {
    setPrompts(prev => prev.filter(p => p.id !== deletingPrompt.id));
    setDeletingPrompt(null);
    setViewingPrompt(null);
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-900 text-warm-800 dark:text-dark-100 transition-colors">
      <Header dark={dark} onToggleTheme={toggleTheme} onNewPrompt={() => setCreateOpen(true)} />

      <div className="max-w-[1160px] mx-auto px-6 sm:px-10 py-7">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryChips active={activeCategory} onSelect={setActiveCategory} />

        {prompts.length === 0 ? (
          <EmptyState onNewPrompt={() => setCreateOpen(true)} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-400 dark:text-dark-400 text-[15px]">
              No se encontraron prompts con esos filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <PromptCard
                key={p.id}
                prompt={p}
                dark={dark}
                onClick={() => setViewingPrompt(p)}
                onEdit={() => setEditingPrompt(p)}
                onDelete={() => setDeletingPrompt(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nuevo Prompt">
        <PromptForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editingPrompt} onClose={() => setEditingPrompt(null)} title="Editar Prompt">
        <PromptForm initial={editingPrompt} onSave={handleEdit} onCancel={() => setEditingPrompt(null)} />
      </Modal>

      {/* Detail view */}
      <PromptDetail
        prompt={viewingPrompt}
        dark={dark}
        onClose={() => setViewingPrompt(null)}
        onEdit={() => { setEditingPrompt(viewingPrompt); setViewingPrompt(null); }}
        onDelete={() => { setDeletingPrompt(viewingPrompt); }}
      />

      {/* Delete confirmation */}
      <DeleteConfirm
        open={!!deletingPrompt}
        onClose={() => setDeletingPrompt(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default App;
