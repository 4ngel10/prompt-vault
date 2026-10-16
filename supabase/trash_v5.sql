-- v5: papelera. Eliminar mueve el item a la papelera (deleted_at) y se puede restaurar durante 30 días.
-- Pasado ese plazo, la app borra definitivamente los items del usuario al cargar.

alter table public.items add column if not exists deleted_at timestamptz;

create index if not exists items_trash_idx on public.items (user_id, deleted_at) where deleted_at is not null;

-- Los items en la papelera dejan de verse para las personas con quien estaban compartidos
drop policy if exists "Users can read items shared with them" on public.items;
create policy "Users can read items shared with them" on public.items
  for select to authenticated using (deleted_at is null and public.shared_with_me(id));

-- ...y su enlace público deja de funcionar mientras estén en la papelera
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
  where i.share_token = p_token and i.deleted_at is null;
$$;

revoke all on function public.get_shared_item(uuid) from public;
grant execute on function public.get_shared_item(uuid) to anon, authenticated;
