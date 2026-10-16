-- Preferencias por usuario (colores de categoría personalizados)
create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  -- { "Escritura": "rose", "Código": "mint" } — claves de COLOR_PALETTE en src/constants.js
  category_colors jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "Users can read own preferences" on public.user_preferences
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own preferences" on public.user_preferences
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own preferences" on public.user_preferences
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
