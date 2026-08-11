import { type RouterContextProvider } from "react-router";
import { OperationType } from "relay-runtime";
import { schema } from "server/graphql-schema";
import invariant from "tiny-invariant";
import type { LoaderQueryArgs } from "@remix-relay/server";
import { getLoaderQuery } from "@remix-relay/server";
import { pothosContext } from "./router-context";

export const loaderQuery = <TQuery extends OperationType>(
  context: Readonly<RouterContextProvider>,
  ...rest: LoaderQueryArgs<TQuery>
) => {
  const pothos = context.get(pothosContext);

  invariant(pothos.user, "Missing user");

  return getLoaderQuery(schema, pothos)<TQuery>(...rest);
};
