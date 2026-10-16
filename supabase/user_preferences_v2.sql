-- v2: orden/lista de categorías y colores de los tipos (prompt / skill)
alter table public.user_preferences
  -- Lista ordenada de categorías del usuario, p. ej. ["Código", "Escritura"]. null = aún no personalizada
  add column if not exists categories jsonb,
  -- { "prompt": "lavender", "skill": "mint" } — claves de COLOR_PALETTE en src/constants.js
  add column if not exists type_colors jsonb not null default '{}'::jsonb;
