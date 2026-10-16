-- Tabla de prompts/skills
create table public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  owner_email text,
  title text not null,
  category text not null,
  text text not null,
  type text not null default 'prompt' check (type in ('prompt', 'skill')),
  is_shared boolean default false,
  created_at timestamptz default now()
);

create index items_user_id_idx on public.items (user_id);
create index items_is_shared_idx on public.items (is_shared) where is_shared;

-- El dueño y su email los fija el servidor, no el cliente
create or replace function public.set_item_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.user_id := auth.uid();
    new.owner_email := auth.jwt() ->> 'email';
  else
    new.user_id := old.user_id;
    new.owner_email := old.owner_email;
  end if;
  return new;
end;
$$;

create trigger items_set_owner
  before insert or update on public.items
  for each row execute function public.set_item_owner();

-- RLS: cada usuario ve los suyos + los compartidos
alter table public.items enable row level security;

create policy "Users can read own items" on public.items
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can read shared items" on public.items
  for select to authenticated using (is_shared = true);

create policy "Users can insert own items" on public.items
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own items" on public.items
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own items" on public.items
  for delete to authenticated using (auth.uid() = user_id);
