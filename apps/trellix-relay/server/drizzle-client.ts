import { Session } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { jwtDecode } from "jwt-decode";
import postgres from "postgres";
import * as schema from "./db-schema";
import { env } from "./env";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { schema });

export function getDb(session: Session) {
  return <T>(cb: (tx: PostgresJsDatabase<typeof schema>) => T | Promise<T>) => {
    const claims = jwtDecode<{ role: string }>(session.access_token);

    return db.transaction(async (tx) => {
      // Set JWT to enable RLS. supabase adds the role and the userId (sub) to the jwt claims
      // Do not use postgres role because it will bypass the RLS, set role to authenticated
      await tx.execute(sql`
        select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(claims))}', true);
        set role '${sql.raw(claims.role)}';
      `);

      const result = await cb(tx);

      await tx.execute(sql`
        select set_config('request.jwt.claims', null, true);
        reset role;
      `);

      return result;
    }) as Promise<T>;
  };
}
