import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./server/db-schema.ts",
  casing: "snake_case",
  migrations: {
    prefix: "supabase",
  },
  out: "./supabase/migrations",
} satisfies Config;
