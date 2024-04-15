import { getLoaderQuery } from "@remix-relay/node";
import type { AppLoadContext } from "@remix-run/cloudflare";
import { defer, json } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { OperationType } from "relay-runtime";
import { PothosContext } from "~/schema/builder";
import * as dbSchema from "~/schema/db-schema";
import { schema } from "~/schema/graphql-schema";

export const loaderQuery = <TQuery extends OperationType>(
  context: AppLoadContext,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB, { schema: dbSchema });
  const loaderQuery = getLoaderQuery<PothosContext>(schema, json, defer, {
    db,
  });

  return loaderQuery<TQuery>(...rest);
};
