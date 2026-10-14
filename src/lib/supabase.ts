import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The ONLY Supabase client in the app. Values come from build-time VITE_ env vars
// (publishable key only — never put a service-role key here).
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export const supabaseConfigError: string | null =
  !supabaseUrl || !supabaseKey
    ? "Authentication is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    : null;

const isBrowser = typeof window !== "undefined";

// Placeholder values keep module evaluation from throwing; every auth call is
// guarded by supabaseConfigError in the UI.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://not-configured.invalid",
  supabaseKey || "not-configured",
  {
    auth: {
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
      detectSessionInUrl: isBrowser,
      storage: isBrowser ? window.localStorage : undefined,
    },
  },
);
