import { type AppLoadContext } from "react-router";
import { OperationType } from "relay-runtime";
import { schema } from "server/graphql-schema";
import invariant from "tiny-invariant";
import type { LoaderQueryArgs } from "@remix-relay/server";
import { getLoaderQuery } from "@remix-relay/server";

export const loaderQuery = <TQuery extends OperationType>(
  { pothosContext }: AppLoadContext,
  ...rest: LoaderQueryArgs<TQuery>
) => {
  invariant(pothosContext.user, "Missing user");
  return getLoaderQuery(schema, pothosContext)<TQuery>(...rest);
};
