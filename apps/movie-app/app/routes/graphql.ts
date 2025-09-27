/* eslint-disable react-hooks/rules-of-hooks */
import { useDeferStream } from "@graphql-yoga/plugin-defer-stream";
import { usePersistedOperations } from "@graphql-yoga/plugin-persisted-operations";
import { drizzle } from "drizzle-orm/d1";
import { createYoga, GraphQLParams } from "graphql-yoga";
import { getSessionStorage } from "~/lib/auth.server";
import exists from "~/lib/exists";
import { PothosContext } from "~/schema/builder";
import * as dbSchema from "~/schema/db-schema";
import { schema } from "~/schema/graphql-schema";
import queryMap from "../persisted-queries.json";
import { Route } from ".react-router/types/app/routes/+types/Graphql";

const yoga = createYoga<PothosContext>({
  schema,
  plugins: [
    usePersistedOperations({
      extractPersistedOperationId(
        params: GraphQLParams & { doc_id?: unknown },
      ) {
        return typeof params.doc_id === "string" ? params.doc_id : null;
      },
      getPersistedOperation(key) {
        return exists(
          (queryMap as Record<string, string>)[key],
          "Missing persisted operation",
        );
      },
    }),
    useDeferStream(),
  ],
});

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB, { schema: dbSchema, casing: "snake_case" });

  const user = (
    await getSessionStorage(context).getSession(request.headers.get("cookie"))
  ).get("user");

  return yoga.handleRequest(request, { db, user });
}
