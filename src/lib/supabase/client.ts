import { createBrowserClient as createBrowserClient_ } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Scoped to the app's dedicated schema via NEXT_PUBLIC_APP_SCHEMA.
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const schema = process.env.NEXT_PUBLIC_APP_SCHEMA || "public";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }

  return createBrowserClient_(supabaseUrl, supabaseAnonKey, {
    db: { schema },
  });
}
