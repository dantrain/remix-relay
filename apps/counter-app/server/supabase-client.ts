import { createClient } from "@supabase/supabase-js";
import { Database } from "./__generated__/database.types";
import { env } from "./env";

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);
