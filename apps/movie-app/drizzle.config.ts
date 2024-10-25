import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./app/schema/db-schema.ts",
  casing: "snake_case",
  migrations: {
    prefix: "supabase",
  },
  out: "./migrations",
} satisfies Config;
