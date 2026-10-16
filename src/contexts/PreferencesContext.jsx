import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  CATEGORIES, COLOR_PALETTE, DEFAULT_TYPE_COLORS,
  getCategoryColors, getColorKey, getDefaultColorKey,
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

// Antes de existir en Supabase, las categorías vivían en localStorage: se usan como punto de partida
function seedCategories() {
  try {
    const stored = sanitizeList(JSON.parse(localStorage.getItem('pv-categories')));
    if (stored) return stored;
  } catch { /* sin datos locales */ }
  return CATEGORIES;
}

export function PreferencesProvider({ user, children }) {
  const [prefs, setPrefs] = useState(() => ({ categoryColors: {}, typeColors: {}, categories: seedCategories() }));
  const [error, setError] = useState(null);
  const latest = useRef(prefs);
  const saveChain = useRef(Promise.resolve());

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('user_preferences')
      .select('category_colors, type_colors, categories')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { setError(error.message); return; }
        const next = {
          categoryColors: sanitizeColors(data?.category_colors),
          typeColors: sanitizeColors(data?.type_colors),
          categories: sanitizeList(data?.categories) ?? latest.current.categories,
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

  const setTypeColor = useCallback((type, key) => {
    const typeColors = { ...latest.current.typeColors };
    if (key === DEFAULT_TYPE_COLORS[type]) delete typeColors[type];
    else typeColors[type] = key;
    update({ typeColors });
  }, [update]);

  const resetColors = useCallback(() => update({ categoryColors: {}, typeColors: {} }), [update]);

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

  const value = useMemo(() => {
    const getTypeKey = (type) => {
      const key = prefs.typeColors[type];
      return COLOR_PALETTE[key] ? key : DEFAULT_TYPE_COLORS[type];
    };
    return {
      error,
      dismissError: () => setError(null),
      categories: prefs.categories,
      getColors: (name) => getCategoryColors(name, prefs.categoryColors),
      getKey: (name) => getColorKey(name, prefs.categoryColors),
      getTypeKey,
      getTypeColors: (type) => COLOR_PALETTE[getTypeKey(type)],
      hasCustomColors: Object.keys(prefs.categoryColors).length + Object.keys(prefs.typeColors).length > 0,
      setCategoryColor,
      setTypeColor,
      resetColors,
      addCategory,
      renameCategory,
      deleteCategory,
      reorderCategories,
    };
  }, [prefs, error, setCategoryColor, setTypeColor, resetColors, addCategory, renameCategory, deleteCategory, reorderCategories]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences debe usarse dentro de <PreferencesProvider>');
  return ctx;
}
