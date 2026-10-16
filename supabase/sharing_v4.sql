-- v4: compartir con personas concretas (por email) y enlace público de solo lectura.
-- Sustituye al modo anterior "visible para todos los usuarios" (is_shared).

-- 1) Compartir con emails concretos
create table if not exists public.item_shares (
  item_id uuid not null references public.items(id) on delete cascade,
  email text not null check (email = lower(email) and position('@' in email) > 1),
  created_at timestamptz not null default now(),
  primary key (item_id, email)
);

alter table public.item_shares enable row level security;

-- Funciones security definer: evitan la recursión entre las políticas de items e item_shares
create or replace function public.owns_item(p_item uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.items where id = p_item and user_id = auth.uid());
$$;

create or replace function public.shared_with_me(p_item uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.item_shares
    where item_id = p_item and email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "Owners and recipients can read shares" on public.item_shares;
drop policy if exists "Owners can add shares" on public.item_shares;
drop policy if exists "Owners can remove shares" on public.item_shares;

create policy "Owners and recipients can read shares" on public.item_shares
  for select to authenticated
  using (public.owns_item(item_id) or email = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "Owners can add shares" on public.item_shares
  for insert to authenticated with check (public.owns_item(item_id));

create policy "Owners can remove shares" on public.item_shares
  for delete to authenticated using (public.owns_item(item_id));

-- Los items ya no son visibles para todos: solo para las personas con quien se comparten
drop policy if exists "Users can read shared items" on public.items;
drop policy if exists "Users can read items shared with them" on public.items;
create policy "Users can read items shared with them" on public.items
  for select to authenticated using (public.shared_with_me(id));

update public.items set is_shared = false where is_shared;

-- 2) Enlace público
alter table public.items add column if not exists share_token uuid unique;

-- Lectura pública por token: devuelve solo lo necesario para mostrar el item (sin datos del autor)
create or replace function public.get_shared_item(p_token uuid)
returns table (title text, text text, category text, type_id text, type_name text, created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select
    i.title,
    i.text,
    i.category,
    i.type,
    coalesce(
      (select t ->> 'name'
         from public.user_preferences p, jsonb_array_elements(coalesce(p.types, '[]'::jsonb)) t
        where p.user_id = i.user_id and t ->> 'id' = i.type
        limit 1),
      case i.type when 'prompt' then 'Prompt' when 'skill' then 'Skill' end
    ),
    i.created_at
  from public.items i
  where i.share_token = p_token;
$$;

revoke all on function public.get_shared_item(uuid) from public;
grant execute on function public.get_shared_item(uuid) to anon, authenticated;
