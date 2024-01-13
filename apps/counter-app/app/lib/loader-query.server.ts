import { getLoaderQuery } from "@remix-relay/server";
import type { AppLoadContext } from "@remix-run/node";
import { OperationType } from "relay-runtime";

export const loaderQuery = <TQuery extends OperationType>(
  context: AppLoadContext,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => getLoaderQuery(context.apolloServer)<TQuery>(...rest);
