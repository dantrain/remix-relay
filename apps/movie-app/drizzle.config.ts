import type { Config } from "drizzle-kit";

export default {
  schema: "./app/schema/db-schema.ts",
  out: "./migrations",
} satisfies Config;
