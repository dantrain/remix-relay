import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { defer, json } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { OperationType } from "relay-runtime";
import { getLoaderQuery } from "@remix-relay/server";
import { PothosContext } from "~/schema/builder";
import * as dbSchema from "~/schema/db-schema";
import { schema } from "~/schema/graphql-schema";
import { authenticator } from "./auth.server";

export const loaderQuery = async <TQuery extends OperationType>(
  loaderFunctionArgs: LoaderFunctionArgs,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  const env = loaderFunctionArgs.context.cloudflare.env as Env;
  const db = drizzle(env.DB, { schema: dbSchema });

  const user = await authenticator.isAuthenticated(loaderFunctionArgs.request);

  const loaderQuery = getLoaderQuery<PothosContext>(schema, json, defer, {
    db,
    user,
  });

  return loaderQuery<TQuery>(...rest);
};
