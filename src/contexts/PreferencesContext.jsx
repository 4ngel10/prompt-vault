import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  CATEGORIES, COLOR_PALETTE, DEFAULT_TYPES, NEUTRAL_COLORS, UNKNOWN_TYPE,
  getCategoryColors, getColorKey, getDefaultColorKey, getDefaultTypeColorKey,
} from '../constants';

const PreferencesContext = createContext(null);

// Descarta claves desconocidas por si la fila se editó a mano o la paleta cambió
function sanitizeColors(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter(([, key]) => COLOR_PALETTE[key]));
}

function sanitizeList(raw) {
  if (!Array.isArray(raw)) return null;
  const seen = new Set();
  return raw.filter(c => typeof c === 'string' && c.trim() && !seen.has(c) && seen.add(c));
}

function sanitizeTypes(raw) {
  if (!Array.isArray(raw)) return null;
  const seen = new Set();
  const types = raw.filter(t => t && typeof t.id === 'string' && typeof t.name === 'string' && t.name.trim() && !seen.has(t.id) && seen.add(t.id))
    .map(({ id, name }) => ({ id, name }));
  return types.length ? types : null;
}

// Antes de existir en Supabase, las categorías vivían en localStorage: se usan como punto de partida
function seedCategories() {
  try {
    const stored = sanitizeList(JSON.parse(localStorage.getItem('pv-categories')));
    if (stored) return stored;
  } catch { /* sin datos locales */ }
  return CATEGORIES;
}

const newTypeId = () => `t-${crypto.randomUUID().slice(0, 8)}`;

export function PreferencesProvider({ user, children }) {
  const [prefs, setPrefs] = useState(() => ({
    categoryColors: {}, typeColors: {}, categories: seedCategories(), types: DEFAULT_TYPES,
  }));
  const [error, setError] = useState(null);
  const latest = useRef(prefs);
  const saveChain = useRef(Promise.resolve());

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('user_preferences')
      .select('category_colors, type_colors, categories, types')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { setError(error.message); return; }
        const next = {
          categoryColors: sanitizeColors(data?.category_colors),
          typeColors: sanitizeColors(data?.type_colors),
          categories: sanitizeList(data?.categories) ?? latest.current.categories,
          types: sanitizeTypes(data?.types) ?? DEFAULT_TYPES,
        };
        latest.current = next;
        setPrefs(next);
      });
    return () => { cancelled = true; };
  }, [user.id]);

  // Se aplica al instante en la interfaz; los guardados se encadenan y cada uno escribe el estado más reciente
  const update = useCallback((changes) => {
    const next = { ...latest.current, ...changes };
    latest.current = next;
    setPrefs(next);
    saveChain.current = saveChain.current.then(async () => {
      const snapshot = latest.current;
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user.id,
        category_colors: snapshot.categoryColors,
        type_colors: snapshot.typeColors,
        categories: snapshot.categories,
        types: snapshot.types,
        updated_at: new Date().toISOString(),
      });
      setError(error ? error.message : null);
    });
  }, [user.id]);

  // Elegir el color por defecto equivale a no tener personalización
  const setCategoryColor = useCallback((name, key) => {
    const categoryColors = { ...latest.current.categoryColors };
    if (key === getDefaultColorKey(name)) delete categoryColors[name];
    else categoryColors[name] = key;
    update({ categoryColors });
  }, [update]);

  const setTypeColor = useCallback((id, key) => {
    const typeColors = { ...latest.current.typeColors };
    if (key === getDefaultTypeColorKey(id)) delete typeColors[id];
    else typeColors[id] = key;
    update({ typeColors });
  }, [update]);

  const resetCategoryColors = useCallback(() => update({ categoryColors: {} }), [update]);
  const resetTypeColors = useCallback(() => update({ typeColors: {} }), [update]);

  const addCategory = useCallback((name) => {
    update({ categories: [...latest.current.categories, name] });
  }, [update]);

  const renameCategory = useCallback((from, to) => {
    const { categories, categoryColors } = latest.current;
    const nextColors = { ...categoryColors };
    // El nuevo nombre conserva el color que tenía la categoría, personalizado o por defecto
    const key = getColorKey(from, categoryColors);
    delete nextColors[from];
    if (key !== getDefaultColorKey(to)) nextColors[to] = key;
    update({ categories: categories.map(c => (c === from ? to : c)), categoryColors: nextColors });
  }, [update]);

  const deleteCategory = useCallback((name) => {
    const { categories, categoryColors } = latest.current;
    const nextColors = { ...categoryColors };
    delete nextColors[name];
    update({ categories: categories.filter(c => c !== name), categoryColors: nextColors });
  }, [update]);

  const reorderCategories = useCallback((categories) => update({ categories }), [update]);

  // Los tipos se identifican por un id estable: renombrar no toca los items
  const addType = useCallback((name) => {
    update({ types: [...latest.current.types, { id: newTypeId(), name }] });
  }, [update]);

  const renameType = useCallback((id, name) => {
    update({ types: latest.current.types.map(t => (t.id === id ? { ...t, name } : t)) });
  }, [update]);

  const deleteType = useCallback((id) => {
    const typeColors = { ...latest.current.typeColors };
    delete typeColors[id];
    update({ types: latest.current.types.filter(t => t.id !== id), typeColors });
  }, [update]);

  const reorderTypes = useCallback((ids) => {
    const byId = Object.fromEntries(latest.current.types.map(t => [t.id, t]));
    update({ types: ids.map(id => byId[id]).filter(Boolean) });
  }, [update]);

  const value = useMemo(() => {
    const typeById = Object.fromEntries(prefs.types.map(t => [t.id, t]));
    const getTypeKey = (id) => {
      const key = prefs.typeColors[id];
      return COLOR_PALETTE[key] ? key : getDefaultTypeColorKey(id);
    };
    return {
      error,
      dismissError: () => setError(null),

      categories: prefs.categories,
      getColors: (name) => getCategoryColors(name, prefs.categoryColors),
      getKey: (name) => getColorKey(name, prefs.categoryColors),
      hasCustomCategoryColors: Object.keys(prefs.categoryColors).length > 0,
      setCategoryColor,
      resetCategoryColors,
      addCategory,
      renameCategory,
      deleteCategory,
      reorderCategories,

      types: prefs.types,
      // Items antiguos sin tipo son prompts; un tipo que no existe en tu lista (compartido por otro) es "Otro"
      resolveType: (item) => typeById[item?.type ?? 'prompt'] ?? (item?.type ? UNKNOWN_TYPE : prefs.types[0]),
      getTypeKey,
      getTypeColors: (id) => (typeById[id] ? COLOR_PALETTE[getTypeKey(id)] : NEUTRAL_COLORS),
      hasCustomTypeColors: Object.keys(prefs.typeColors).length > 0,
      setTypeColor,
      resetTypeColors,
      addType,
      renameType,
      deleteType,
      reorderTypes,
    };
  }, [prefs, error, setCategoryColor, resetCategoryColors, addCategory, renameCategory, deleteCategory, reorderCategories,
    setTypeColor, resetTypeColors, addType, renameType, deleteType, reorderTypes]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences debe usarse dentro de <PreferencesProvider>');
  return ctx;
}
