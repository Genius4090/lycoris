import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS and can use auth.admin API.
// Only used for admin operations (creating/deleting users).
// Never expose this key to regular users — it's only reachable
// through dashboard pages which are guarded by DashboardRoute.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
