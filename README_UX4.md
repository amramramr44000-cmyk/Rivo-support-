# Rivo Support UX4

This update is focused on reliability and ease of use:
- Menu-first navigation on desktop and phone.
- New-ticket navigation is session-aware.
- Ticket forms stop accidental page reloads.
- Message composer is bound before ticket rendering so a rendering/API issue does not turn send into a normal form submit.
- Ticket messages refresh through Supabase Realtime when available and after successful sends.
- Admin Assign / Release / Close / Reopen buttons are type=button and protected with loading/error feedback.
- Suggestions are non-blocking; if the suggestions RPC fails, the chat still loads.
- No changes to existing Rivo account/profile tables are included.

Run `supabase/support_runtime_hardening.sql` once in Supabase if the deployed project still has older support RPC definitions.
