import { drizzle } from "drizzle-orm/d1";
import type { LoaderFunctionArgs } from "react-router";
import { OperationType } from "relay-runtime";
import type { LoaderQueryArgs } from "@remix-relay/server";
import { getLoaderQuery } from "@remix-relay/server";
import { PothosContext } from "~/schema/builder";
import * as dbSchema from "~/schema/db-schema";
import { schema } from "~/schema/graphql-schema";
import queryMap from "../persisted-queries.json";
import { getSessionStorage } from "./auth.server";

export const loaderQuery = async <TQuery extends OperationType>(
  { request, context }: LoaderFunctionArgs,
  ...rest: LoaderQueryArgs<TQuery>
) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB, { schema: dbSchema, casing: "snake_case" });

  const user = (
    await getSessionStorage(context).getSession(request.headers.get("cookie"))
  ).get("user");

  const loaderQuery = getLoaderQuery<PothosContext>(
    schema,
    { db, user },
    queryMap,
  );

  return loaderQuery<TQuery>(...rest);
};
