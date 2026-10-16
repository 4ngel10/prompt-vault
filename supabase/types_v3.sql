-- v3: tipos personalizables por usuario
-- items.type deja de estar limitado a 'prompt' | 'skill': guarda el id de un tipo definido en user_preferences.types
alter table public.items drop constraint if exists items_type_check;
alter table public.items drop constraint if exists items_type_format;
alter table public.items
  add constraint items_type_format check (char_length(type) between 1 and 40);

-- Lista ordenada de tipos del usuario: [{ "id": "prompt", "name": "Prompt" }, ...]. null = tipos por defecto
alter table public.user_preferences
  add column if not exists types jsonb;
