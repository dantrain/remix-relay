import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./server/db-schema.ts",
  out: "./supabase/migrations",
} satisfies Config;
