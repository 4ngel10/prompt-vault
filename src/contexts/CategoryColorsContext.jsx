import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { COLOR_PALETTE, getCategoryColors, getColorKey, getDefaultColorKey } from '../constants';

const CategoryColorsContext = createContext(null);

// Descarta claves desconocidas por si la fila se editó a mano o la paleta cambió
function sanitize(raw) {
  if (!raw || typeof raw !== 'object') return {};
  return Object.fromEntries(Object.entries(raw).filter(([, key]) => COLOR_PALETTE[key]));
}

export function CategoryColorsProvider({ user, children }) {
  const [overrides, setOverrides] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('user_preferences')
      .select('category_colors')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setOverrides(sanitize(data?.category_colors));
      });
    return () => { cancelled = true; };
  }, [user.id]);

  // Se aplica al instante en la interfaz y se guarda en segundo plano
  const persist = useCallback(async (next) => {
    setOverrides(next);
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: user.id, category_colors: next, updated_at: new Date().toISOString() });
    setError(error ? error.message : null);
  }, [user.id]);

  const setCategoryColor = useCallback((name, key) => {
    const next = { ...overrides };
    // Elegir el color por defecto equivale a no tener personalización
    if (key === getDefaultColorKey(name)) delete next[name];
    else next[name] = key;
    persist(next);
  }, [overrides, persist]);

  const resetColors = useCallback(() => persist({}), [persist]);

  const value = useMemo(() => ({
    overrides,
    error,
    getColors: (name) => getCategoryColors(name, overrides),
    getKey: (name) => getColorKey(name, overrides),
    setCategoryColor,
    resetColors,
    hasCustomColors: Object.keys(overrides).length > 0,
  }), [overrides, error, setCategoryColor, resetColors]);

  return <CategoryColorsContext.Provider value={value}>{children}</CategoryColorsContext.Provider>;
}

export function useCategoryColors() {
  const ctx = useContext(CategoryColorsContext);
  if (!ctx) throw new Error('useCategoryColors debe usarse dentro de <CategoryColorsProvider>');
  return ctx;
}
