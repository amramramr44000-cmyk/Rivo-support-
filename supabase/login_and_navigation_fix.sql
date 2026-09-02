-- Rivo Support: login + navigation compatibility patch
-- Run once after the support portal migration.

create or replace function public.rivo_get_login_email(p_username text)
returns text
language sql
security definer
set search_path = public, auth
as $$
  select u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.username) = lower(trim(both '@' from coalesce(p_username, '')))
  limit 1;
$$;

revoke all on function public.rivo_get_login_email(text) from public;
grant execute on function public.rivo_get_login_email(text) to anon, authenticated;
