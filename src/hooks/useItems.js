import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const COLUMNS = 'id, user_id, owner_email, title, category, text, type, is_shared, created_at';

export function useItems(user) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Marca si el item pertenece al usuario actual (los demás son compartidos por otros)
  const withOwnership = useCallback(row => ({ ...row, isOwn: row.user_id === user.id }), [user.id]);

  const run = async (promise) => {
    const { data, error } = await promise;
    if (error) {
      setError(error.message);
      throw error;
    }
    setError(null);
    return data;
  };

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('items')
      .select(COLUMNS)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setItems(data.map(withOwnership));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [withOwnership]);

  const createItem = async ({ title, category, text, type }) => {
    const row = await run(
      supabase.from('items').insert({ user_id: user.id, title, category, text, type }).select(COLUMNS).single()
    );
    setItems(prev => [withOwnership(row), ...prev]);
  };

  const updateItem = async (id, changes) => {
    const row = await run(
      supabase.from('items').update(changes).eq('id', id).select(COLUMNS).single()
    );
    setItems(prev => prev.map(i => i.id === id ? withOwnership(row) : i));
  };

  const deleteItem = async (id) => {
    await run(supabase.from('items').delete().eq('id', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleShare = (item) => updateItem(item.id, { is_shared: !item.is_shared });

  const clearCategory = async (name) => {
    await run(supabase.from('items').update({ category: '' }).eq('user_id', user.id).eq('category', name));
    setItems(prev => prev.map(i => i.isOwn && i.category === name ? { ...i, category: '' } : i));
  };

  const renameCategory = async (from, to) => {
    await run(supabase.from('items').update({ category: to }).eq('user_id', user.id).eq('category', from));
    setItems(prev => prev.map(i => i.isOwn && i.category === from ? { ...i, category: to } : i));
  };

  return { items, loading, error, dismissError: () => setError(null), createItem, updateItem, deleteItem, toggleShare, clearCategory, renameCategory };
}
