# Rivo Support UX22 — Admin Self Close

Regular support admins can now:
- claim an unassigned active ticket;
- reply while it is assigned to them;
- release their own ticket;
- close their own active ticket.

They still cannot transfer or reopen tickets. The Owner retains full control.

Use `supabase/support_ux21_roles.sql` after UX20; it contains the updated permission and RPC logic.
