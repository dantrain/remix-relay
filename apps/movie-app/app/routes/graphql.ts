/* eslint-disable react-hooks/rules-of-hooks */
import { useDeferStream } from "@graphql-yoga/plugin-defer-stream";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { createYoga } from "graphql-yoga";
import { getSessionStorage } from "~/lib/auth.server";
import { PothosContext } from "~/schema/builder";
import * as dbSchema from "~/schema/db-schema";
import { schema } from "~/schema/graphql-schema";

const yoga = createYoga<PothosContext>({ schema, plugins: [useDeferStream()] });

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB, { schema: dbSchema, casing: "snake_case" });

  const user = (
    await getSessionStorage(context).getSession(request.headers.get("cookie"))
  ).get("user");

  return yoga.handleRequest(request, { db, user });
}
