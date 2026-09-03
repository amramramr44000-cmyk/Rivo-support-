# Rivo Support UX21 — Roles

UX21 introduces an explicit support-role hierarchy.

- Owner/developer: seeded automatically from `public.profiles.username = 'amr7'` into `public.rivo_support_owners`.
- Regular support admins: add their `user_id` to `public.rivo_support_admins`.
- Regular admins may claim unassigned active tickets, reply only while the ticket is assigned to them, and close or release tickets they currently own.
- Regular admins cannot transfer or reopen tickets; closing is allowed only for the active ticket currently assigned to themselves.
- Owner can reply to any ticket and has full ticket controls.
- Customer-visible owner messages are already labeled `المطور / Developer` by the existing message renderer.
- Existing `rivo_admin_users` is no longer used as the support role source by UX21; support access comes only from the two explicit role tables.

Run `supabase/support_ux21_roles.sql` after UX20. This version includes the regular-admin self-close permission.
