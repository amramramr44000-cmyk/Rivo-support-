# Rivo Support UX20

## Permission model

- **Regular admin:** can open/read tickets, claim an unassigned active ticket, reply only while that ticket is assigned to them, and release their own ticket. They cannot reply to a ticket assigned to another admin and cannot close/reopen/change ticket status.
- **Owner / Developer:** full support access. Can reply to any ticket, including a ticket assigned to another admin or a closed ticket. Can close, reopen, release, claim, and transfer tickets.
- **Customer:** can reply only to their own non-closed tickets. Closed tickets remain hidden until an owner/admin reopens them.

## Developer label

Messages sent by a recognized owner are exposed to the customer as **المطور / Developer** instead of **دعم Rivo**.

## Marking the owner

The safe/default owner marker is the `rivo_support_owners` table. Add the owner account UUID once in Supabase SQL:

```sql
insert into public.rivo_support_owners(user_id)
values ('OWNER-USER-UUID-HERE')
on conflict do nothing;
```

The migration also recognizes a server-controlled Supabase Auth `app_metadata.role` value of `owner`, `super_owner`, `developer`, or `dev` for the currently signed-in user.

Run `supabase/support_ux20_permissions.sql` after UX19.
