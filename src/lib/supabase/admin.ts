import { createClient } from "@supabase/supabase-js";
import { supabaseSecretKey, supabaseUrl } from "./config";
import type { Database } from "./database.types";

export function createSupabaseAdminClient() {
  return createClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
