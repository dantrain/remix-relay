import { getLoaderQuery } from "@remix-relay/node";
import type { AppLoadContext } from "@remix-run/node";
import { OperationType } from "relay-runtime";
import invariant from "tiny-invariant";

export const loaderQuery = <TQuery extends OperationType>(
  { apolloServer, apolloContext }: AppLoadContext,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  invariant(apolloContext.user);
  return getLoaderQuery(apolloServer, apolloContext)<TQuery>(...rest);
};
