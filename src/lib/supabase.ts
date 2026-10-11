import { createClient } from "@supabase/supabase-js";



VITE_SUPABASE_URL=https://xouknyrwiyccjfkwilrj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_peKNo47aUhLKDLXJkI-Bhw_wQ8wLFzc


if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
