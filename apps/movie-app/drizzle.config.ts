import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./app/schema/db-schema.ts",
  out: "./migrations",
} satisfies Config;
