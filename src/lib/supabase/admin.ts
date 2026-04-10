import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using SERVICE_ROLE_KEY.
 * Bypasses RLS — server-side only. Scoped to the app's schema
 * via NEXT_PUBLIC_APP_SCHEMA (default "public").
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const schema = process.env.NEXT_PUBLIC_APP_SCHEMA || "public";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
