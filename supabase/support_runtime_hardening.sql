-- Rivo Support runtime hardening (safe additive patch)
-- Re-applies only the support RPCs used by the current UI.
-- Does not alter Rivo account/auth/profile tables.

create or replace function public.rivo_support_create_ticket(
  p_subject text,p_category text default 'other',p_priority text default 'normal',p_message text default ''
) returns jsonb language plpgsql security definer set search_path=public as $$
declare tid uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if char_length(trim(coalesce(p_subject,''))) < 3 then raise exception 'عنوان المشكلة قصير جدًا'; end if;
  insert into public.rivo_support_tickets(user_id,subject,category,priority)
  values(auth.uid(),trim(p_subject),
    case when p_category in ('account','technical','payment','report','privacy','other') then p_category else 'other' end,
    case when p_priority in ('low','normal','high') then p_priority else 'normal' end)
  returning id into tid;
  if char_length(trim(coalesce(p_message,''))) > 0 then
    insert into public.rivo_support_messages(ticket_id,sender_id,content)
    values(tid,auth.uid(),trim(p_message));
    update public.rivo_support_tickets set last_message_at=now(),updated_at=now() where id=tid;
  end if;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(tid,auth.uid(),'created',jsonb_build_object('category',p_category,'priority',p_priority));
  return jsonb_build_object('id',tid);
end;
$$;

create or replace function public.rivo_support_send_message(
  p_ticket_id uuid,p_content text default '',p_attachment_path text default null
) returns jsonb language plpgsql security definer set search_path=public as $$
declare t public.rivo_support_tickets; sid uuid:=auth.uid(); mid bigint; is_admin boolean;
begin
  if sid is null then raise exception 'Not authenticated'; end if;
  select * into t from public.rivo_support_tickets where id=p_ticket_id;
  if not found then raise exception 'Ticket not found'; end if;
  is_admin:=public.rivo_is_admin(sid);
  if t.user_id<>sid and not is_admin then raise exception 'Access denied'; end if;
  if t.status='closed' then raise exception 'البلاغ مغلق. أعد فتحه قبل إرسال رسالة.'; end if;
  if char_length(trim(coalesce(p_content,'')))=0 and nullif(trim(coalesce(p_attachment_path,'')),'') is null then raise exception 'Message is empty'; end if;
  if p_attachment_path is not null and p_attachment_path<>'' and position(sid::text||'/' in p_attachment_path)<>1 and not is_admin then raise exception 'Invalid attachment path'; end if;
  insert into public.rivo_support_messages(ticket_id,sender_id,content,attachment_path,attachment_type)
  values(p_ticket_id,sid,trim(coalesce(p_content,'')),nullif(trim(p_attachment_path),''),case when p_attachment_path is null then null else 'image' end)
  returning id into mid;
  update public.rivo_support_tickets
    set updated_at=now(),last_message_at=now(),status=case when is_admin then 'pending' else 'open' end
    where id=p_ticket_id;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,sid,'message',jsonb_build_object('message_id',mid));
  return jsonb_build_object('id',mid);
end;
$$;

create or replace function public.rivo_support_assign_ticket(p_ticket_id uuid)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not public.rivo_is_admin(auth.uid()) then raise exception 'Access denied'; end if;
  update public.rivo_support_tickets
  set assigned_admin_id=auth.uid(),status=case when status='closed' then 'open' else status end,updated_at=now()
  where id=p_ticket_id;
  if not found then raise exception 'Ticket not found'; end if;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type) values(p_ticket_id,auth.uid(),'assigned');
  return true;
end;
$$;

create or replace function public.rivo_support_release_ticket(p_ticket_id uuid)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not public.rivo_is_admin(auth.uid()) then raise exception 'Access denied'; end if;
  update public.rivo_support_tickets set assigned_admin_id=null,updated_at=now() where id=p_ticket_id;
  if not found then raise exception 'Ticket not found'; end if;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type) values(p_ticket_id,auth.uid(),'released');
  return true;
end;
$$;

create or replace function public.rivo_support_set_ticket_status(p_ticket_id uuid,p_status text)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not public.rivo_is_admin(auth.uid()) then raise exception 'Access denied'; end if;
  if p_status not in ('open','pending','closed') then raise exception 'Invalid status'; end if;
  update public.rivo_support_tickets set status=p_status,updated_at=now() where id=p_ticket_id;
  if not found then raise exception 'Ticket not found'; end if;
  insert into public.rivo_support_events(ticket_id,actor_id,event_type,payload)
  values(p_ticket_id,auth.uid(),'status',jsonb_build_object('status',p_status));
  return true;
end;
$$;

grant execute on function public.rivo_support_create_ticket(text,text,text,text) to authenticated;
grant execute on function public.rivo_support_send_message(uuid,text,text) to authenticated;
grant execute on function public.rivo_support_assign_ticket(uuid) to authenticated;
grant execute on function public.rivo_support_release_ticket(uuid) to authenticated;
grant execute on function public.rivo_support_set_ticket_status(uuid,text) to authenticated;
