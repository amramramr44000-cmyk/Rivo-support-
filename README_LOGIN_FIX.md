# Rivo Support login/navigation fix

This patch fixes the missing `public.rivo_get_login_email(text)` RPC used by the support login page and refreshes the app.js cache version so browsers load the corrected login/logout/navigation code.

Run `supabase/login_and_navigation_fix.sql` once in Supabase SQL Editor. The main `supabase/support_portal.sql` has also been updated to include the login bridge for future fresh installs.
