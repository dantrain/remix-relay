import { Session } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { jwtDecode } from "jwt-decode";
import postgres from "postgres";
import { env } from "./env";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client);

export function getDb(session: Session) {
  return <T>(cb: (tx: PostgresJsDatabase) => T | Promise<T>) => {
    const claims = jwtDecode<{ role: string }>(session.access_token);

    return db.transaction(async (tx) => {
      // Set JWT to enable RLS. supabase adds the role and the userId (sub) to the jwt claims
      await tx.execute(
        sql`SELECT set_config('request.jwt.claims', '${sql.raw(JSON.stringify(claims))}', TRUE)`,
      );

      // do not use postgres because it will bypass the RLS, set role to authenticated
      await tx.execute(sql`set role '${sql.raw(claims.role)}'`);

      const result = await cb(tx);

      await tx.execute(
        sql`SELECT set_config('request.jwt.claims', NULL, true);`,
      );

      await tx.execute(sql`RESET ROLE;`);

      return result;
    }) as Promise<T>;
  };
}
