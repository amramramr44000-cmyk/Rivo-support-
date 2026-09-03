# Rivo Support UX16

## What changed

- Closed tickets remain stored in the database but are hidden from customers.
- Customers cannot open a closed ticket directly, read its messages, or read its attachments.
- Reopening the same ticket makes it visible to the customer again with the complete message history intact.
- Admins can reply to any ticket without claiming it first.
- Admins can reply even while a ticket is closed; an admin reply does **not** reopen it automatically.
- Any admin can claim, release, transfer, close, reopen, or change the status of any ticket.
- Assignment is now coordination metadata, not a permission barrier.

## SQL migration

Run:

`supabase/support_ux16_permissions.sql`

Run it **after** the previous support SQL files so UX16 definitions are the final versions of the RPCs/policies.
