import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    env: Env;
  }
}

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(result.error.issues);

  throw new Error("There is an error with the server environment variables");
}

export const env = result.data;
