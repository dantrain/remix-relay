import { defer, json, type AppLoadContext } from "@remix-run/node";
import { OperationType } from "relay-runtime";
import { schema } from "server/graphql/schema";
import invariant from "tiny-invariant";
import { getLoaderQuery } from "@remix-relay/server";

export const loaderQuery = <TQuery extends OperationType>(
  { pothosContext }: AppLoadContext,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  invariant(pothosContext.user);
  return getLoaderQuery(schema, json, defer, pothosContext)<TQuery>(...rest);
};
