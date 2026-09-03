# Rivo Support — UX19 Hotfix

## What was fixed
- Fixed the fatal admin-ticket JavaScript bug that prevented the ticket detail controller from initializing: `const adminId=adminId` is now `const adminId=currentUserId(ctx)`.
- Admin ticket replies remain unrestricted by assignment ownership.
- Any authorized admin can claim an unassigned ticket.
- Any authorized admin can reply to a ticket assigned to another admin.
- Any authorized admin can reply to a closed ticket; it stays closed until explicitly reopened.
- Reopening a ticket makes it visible to its customer again.
- Admin attachment uploads are allowed by the Storage INSERT policy.
- Frontend cache version bumped to UX19.

## Supabase
Run:
`supabase/support_ux19_permissions.sql`

Run it **after** the base support SQL and after any older assignment/runtime SQL. It is the final override and should be the last support permissions patch.

Do not run the old `support_assignment_policy.sql` after UX19 unless you replace it with the included UX19-aligned copy.
