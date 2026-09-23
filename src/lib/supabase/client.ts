import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "./config";
import type { Database } from "./database.types";

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
