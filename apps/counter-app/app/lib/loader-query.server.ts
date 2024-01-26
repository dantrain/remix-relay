import { getLoaderQuery } from "@remix-relay/server";
import type { AppLoadContext } from "@remix-run/node";
import { OperationType } from "relay-runtime";

export const loaderQuery = <TQuery extends OperationType>(
  { apolloServer, apolloContext }: AppLoadContext,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  return getLoaderQuery(apolloServer, apolloContext)<TQuery>(...rest);
};
