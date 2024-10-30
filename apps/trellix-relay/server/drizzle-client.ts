import { Session } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { jwtDecode } from "jwt-decode";
import postgres from "postgres";
import * as schema from "./db-schema";
import { env } from "./env";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { schema, casing: "snake_case" });

export function getDb(session: Session) {
  return <T>(cb: (tx: PostgresJsDatabase<typeof schema>) => T | Promise<T>) => {
    const claims = jwtDecode<{ role?: string; sub?: string }>(
      session.access_token,
    );

    return db.transaction(async (tx) => {
      try {
        // Set JWT to enable RLS. supabase adds the role and the userId (sub) to the jwt claims
        // Do not use postgres role because it will bypass the RLS, set role to authenticated
        await tx.execute(sql`
          select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(claims))}', true);
          select set_config('request.jwt.claim.sub', '${sql.raw(claims.sub ?? "")}', true);
          set local role '${sql.raw(claims.role ?? "anon")}';
        `);

        return await cb(tx);
      } finally {
        await tx.execute(sql`
          select set_config('request.jwt.claims', null, true);
          select set_config('request.jwt.claim.sub', null, true);
          reset role;
        `);
      }
    }) as Promise<T>;
  };
}
