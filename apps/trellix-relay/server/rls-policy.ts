import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";

export default pgPolicy(
  "Enable all operations for authenticated users based on userId",
  {
    as: "permissive",
    for: "all",
    to: authenticatedRole,
    using: sql`(select auth.uid()) = user_id`,
    withCheck: sql`(select auth.uid()) = user_id`,
  },
);
