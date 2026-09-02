-- Rivo Support: strict assignment, transfer and chat ownership rules.
-- Additive patch. Does not modify Rivo account/auth tables.

create or replace function public.rivo_support_send_message(
  p_ticket_id uuid,
  p_content text default '',
  p_attachment_path text default null
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  t public.rivo_support_tickets;
  sid uuid := auth.uid();
  mid bigint;
  is_admin boolean;
begin
  if sid is null then raise exception 'Not authenticated'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id;
  if not found then raise exception 'Ticket not found'; end if;

  is_admin := public.rivo_is_admin(sid);
  if t.user_id <> sid and not is_admin then raise exception 'Access denied'; end if;

  -- Only the assigned admin may write as staff. Unassigned admins cannot reply.
  if is_admin and t.assigned_admin_id is distinct from sid then
    raise exception 'استلم البلاغ أولًا قبل الرد.';
  end if;

  if t.status='closed' then raise exception 'البلاغ مغلق. أعد فتحه قبل إرسال رسالة.'; end if;
  if char_length(trim(coalesce(p_content,'')))=0 and nullif(trim(coalesce(p_attachment_path,'')),'') is null then
    raise exception 'Message is empty';
  end if;
  if p_attachment_path is not null and p_attachment_path<>''
     and position(sid::text||'/' in p_attachment_path)<>1 and not is_admin then
    raise exception 'Invalid attachment path';
  end if;

  insert into public.rivo_support_messages(ticket_id,sender_id,content,attachment_path,attachment_type)
  values(p_ticket_id,sid,trim(coalesce(p_content,'')),nullif(trim(p_attachment_path),''),
         case when p_attachment_path is null then null else 'image' end)
  returning id into mid;

  update public.rivo_support_tickets
  set updated_at=now(),
      last_message_at=now(),
      status=case when is_admin then 'pending' else 'open' end
  where id=p_ticket_id;

  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,sid,'message',jsonb_build_object('message_id',mid));

  return jsonb_build_object('id',mid);
end;
$$;

create or replace function public.rivo_support_assign_ticket(p_ticket_id uuid)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare sid uuid:=auth.uid(); t public.rivo_support_tickets;
begin
  if sid is null or not public.rivo_is_admin(sid) then raise exception 'Access denied'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id for update;
  if not found then raise exception 'Ticket not found'; end if;
  if t.assigned_admin_id is not null and t.assigned_admin_id is distinct from sid then
    raise exception 'البلاغ مستلم بالفعل من موظف دعم آخر.';
  end if;
  update public.rivo_support_tickets
    set assigned_admin_id=sid,
        status=case when status='closed' then 'open' else status end,
        updated_at=now()
  where id=p_ticket_id;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,sid,'assigned',jsonb_build_object('admin_id',sid));
  return true;
end;
$$;

create or replace function public.rivo_support_release_ticket(p_ticket_id uuid)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare sid uuid:=auth.uid(); t public.rivo_support_tickets;
begin
  if sid is null or not public.rivo_is_admin(sid) then raise exception 'Access denied'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id for update;
  if not found then raise exception 'Ticket not found'; end if;
  if t.assigned_admin_id is distinct from sid then raise exception 'أنت غير مستلم هذا البلاغ.'; end if;
  update public.rivo_support_tickets set assigned_admin_id=null,updated_at=now() where id=p_ticket_id;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,sid,'released',jsonb_build_object('admin_id',sid));
  return true;
end;
$$;

create or replace function public.rivo_support_transfer_ticket(p_ticket_id uuid,p_new_admin_id uuid)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare sid uuid:=auth.uid(); t public.rivo_support_tickets;
begin
  if sid is null or not public.rivo_is_admin(sid) then raise exception 'Access denied'; end if;
  if p_new_admin_id is null then raise exception 'اختر موظف دعم.'; end if;
  if not public.rivo_is_admin(p_new_admin_id) then raise exception 'الموظف المحدد ليس ضمن فريق الدعم.'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id for update;
  if not found then raise exception 'Ticket not found'; end if;
  if t.assigned_admin_id is distinct from sid then raise exception 'استلم البلاغ قبل تحويله.'; end if;
  if p_new_admin_id=sid then raise exception 'البلاغ مستلم منك بالفعل.'; end if;
  update public.rivo_support_tickets
    set assigned_admin_id=p_new_admin_id,
        updated_at=now()
  where id=p_ticket_id;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,sid,'transferred',jsonb_build_object('from',sid,'to',p_new_admin_id));
  return true;
end;
$$;

create or replace function public.rivo_support_list_admins()
returns setof jsonb
language sql
stable
security definer
set search_path=public
as $$
  select jsonb_build_object(
    'id',p.id,
    'username',p.username,
    'display_name',coalesce(p.public_data->>'displayName',p.username)
  )
  from public.profiles p
  where public.rivo_is_admin(p.id)
  order by coalesce(p.public_data->>'displayName',p.username);
$$;

create or replace function public.rivo_support_set_ticket_status(p_ticket_id uuid,p_status text)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare sid uuid:=auth.uid(); t public.rivo_support_tickets;
begin
  if sid is null or not public.rivo_is_admin(sid) then raise exception 'Access denied'; end if;
  if p_status not in ('open','pending','closed') then raise exception 'Invalid status'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id for update;
  if not found then raise exception 'Ticket not found'; end if;
  -- Closing/pending requires the current assignee. Re-opening may be done by any admin;
  -- it clears the previous owner so a fresh agent can claim the case.
  if p_status='open' and t.status='closed' then
    update public.rivo_support_tickets set status='open',assigned_admin_id=null,updated_at=now() where id=p_ticket_id;
  else
    if t.assigned_admin_id is distinct from sid then
      raise exception 'استلم البلاغ أولًا قبل تغيير حالته.';
    end if;
    update public.rivo_support_tickets set status=p_status,updated_at=now() where id=p_ticket_id;
  end if;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,sid,'status',jsonb_build_object('status',p_status));
  return true;
end;
$$;

-- Return staff sender names only to admins. Customers see a neutral support identity.
create or replace function public.rivo_support_get_ticket(p_ticket_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  t public.rivo_support_tickets;
  out jsonb;
  can_see boolean;
  viewer_is_admin boolean;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id;
  if not found then raise exception 'Ticket not found'; end if;
  viewer_is_admin := public.rivo_is_admin(auth.uid());
  can_see := t.user_id=auth.uid() or viewer_is_admin;
  if not can_see then raise exception 'Access denied'; end if;

  select jsonb_build_object(
    'id',t.id,'subject',t.subject,'category',t.category,'priority',t.priority,'status',t.status,
    'status_label',case t.status when 'open' then 'مفتوح' when 'pending' then 'بانتظار الرد' else 'مغلق' end,
    'priority_label',case t.priority when 'high' then 'عالية' when 'low' then 'منخفضة' else 'عادية' end,
    'assigned_admin_id',t.assigned_admin_id,
    'assigned_admin',case when not viewer_is_admin or t.assigned_admin_id is null then null else (
      select jsonb_build_object('id',ap.id,'username',ap.username,'display_name',coalesce(ap.public_data->>'displayName',ap.username))
      from public.profiles ap where ap.id=t.assigned_admin_id
    ) end,
    'user',jsonb_build_object('id',p.id,'username',p.username,'display_name',coalesce(p.public_data->>'displayName',p.username)),
    'messages',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',m.id,'sender_id',m.sender_id,
        'sender_name',case
          when m.sender_id=t.user_id then coalesce(mp.public_data->>'displayName',mp.username)
          when viewer_is_admin then coalesce(mp.public_data->>'displayName',mp.username)
          else 'Rivo Support'
        end,
        'is_support',m.sender_id<>t.user_id,
        'content',m.content,'created_at',m.created_at,'attachment_path',m.attachment_path,'attachment_type',m.attachment_type
      ) order by m.created_at asc)
      from public.rivo_support_messages m
      join public.profiles mp on mp.id=m.sender_id
      where m.ticket_id=t.id
    ),'[]'::jsonb)
  ) into out
  from public.profiles p where p.id=t.user_id;
  return out;
end;
$$;

revoke all on function public.rivo_support_transfer_ticket(uuid,uuid) from public;
revoke all on function public.rivo_support_list_admins() from public;
grant execute on function public.rivo_support_transfer_ticket(uuid,uuid) to authenticated;
grant execute on function public.rivo_support_list_admins() to authenticated;
grant execute on function public.rivo_support_send_message(uuid,text,text) to authenticated;
grant execute on function public.rivo_support_assign_ticket(uuid) to authenticated;
grant execute on function public.rivo_support_release_ticket(uuid) to authenticated;
grant execute on function public.rivo_support_set_ticket_status(uuid,text) to authenticated;
grant execute on function public.rivo_support_get_ticket(uuid) to authenticated;

-- Allow a ticket participant (customer or authorized staff) to view attachments
-- attached to that ticket, regardless of which participant uploaded the image.
drop policy if exists "support_media_select" on storage.objects;
create policy "support_media_select" on storage.objects for select to authenticated
using (
  bucket_id='rivo-support-media'
  and (
    name like auth.uid()::text || '/%'
    or public.rivo_is_admin(auth.uid())
    or exists (
      select 1
      from public.rivo_support_messages m
      join public.rivo_support_tickets t on t.id=m.ticket_id
      where m.attachment_path=name
        and (t.user_id=auth.uid() or public.rivo_is_admin(auth.uid()))
    )
  )
);
