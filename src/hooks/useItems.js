import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const COLUMNS = 'id, user_id, owner_email, title, category, text, type, share_token, created_at';

export function useItems(user) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Marca si el item pertenece al usuario actual (los demás los han compartido contigo).
  // `shares` son los emails con los que has compartido un item propio.
  const withOwnership = useCallback(
    (row, shares = []) => ({ ...row, isOwn: row.user_id === user.id, shares }),
    [user.id]
  );

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
    Promise.all([
      supabase.from('items').select(COLUMNS).order('created_at', { ascending: false }),
      supabase.from('item_shares').select('item_id, email').order('created_at'),
    ]).then(([itemsRes, sharesRes]) => {
      if (cancelled) return;
      if (itemsRes.error) { setError(itemsRes.error.message); setLoading(false); return; }
      if (sharesRes.error) setError(sharesRes.error.message);
      const byItem = {};
      for (const s of sharesRes.data ?? []) (byItem[s.item_id] ??= []).push(s.email);
      // Las filas de item_shares de items ajenos son las que te incluyen a ti: no se muestran como "compartido con"
      setItems(itemsRes.data.map(row => withOwnership(row, row.user_id === user.id ? byItem[row.id] ?? [] : [])));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [withOwnership, user.id]);

  const patchItem = (id, fn) => setItems(prev => prev.map(i => (i.id === id ? fn(i) : i)));

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
    patchItem(id, i => withOwnership(row, i.shares));
  };

  const deleteItem = async (id) => {
    await run(supabase.from('items').delete().eq('id', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Compartir con una persona: la verá en su bóveda al iniciar sesión con ese email
  const addShare = async (id, email) => {
    await run(supabase.from('item_shares').insert({ item_id: id, email }));
    patchItem(id, i => ({ ...i, shares: [...i.shares, email] }));
  };

  const removeShare = async (id, email) => {
    await run(supabase.from('item_shares').delete().eq('item_id', id).eq('email', email));
    patchItem(id, i => ({ ...i, shares: i.shares.filter(e => e !== email) }));
  };

  // Enlace público: un token aleatorio activa la lectura sin cuenta; null lo desactiva
  const setPublicLink = (id, enabled) =>
    updateItem(id, { share_token: enabled ? crypto.randomUUID() : null });

  const clearCategory = async (name) => {
    await run(supabase.from('items').update({ category: '' }).eq('user_id', user.id).eq('category', name));
    setItems(prev => prev.map(i => i.isOwn && i.category === name ? { ...i, category: '' } : i));
  };

  const renameCategory = async (from, to) => {
    await run(supabase.from('items').update({ category: to }).eq('user_id', user.id).eq('category', from));
    setItems(prev => prev.map(i => i.isOwn && i.category === from ? { ...i, category: to } : i));
  };

  // Al eliminar un tipo, sus items propios pasan a otro tipo
  const reassignType = async (from, to) => {
    await run(supabase.from('items').update({ type: to }).eq('user_id', user.id).eq('type', from));
    setItems(prev => prev.map(i => i.isOwn && i.type === from ? { ...i, type: to } : i));
  };

  return {
    items, loading, error, dismissError: () => setError(null),
    createItem, updateItem, deleteItem,
    addShare, removeShare, setPublicLink,
    clearCategory, renameCategory, reassignType,
  };
}
