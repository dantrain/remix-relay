import { LoaderFunctionArgs, defer, json } from "@remix-run/node";
import { OperationType } from "relay-runtime";
import { schema } from "server/graphql-schema";
import invariant from "tiny-invariant";
import { getLoaderQuery } from "@remix-relay/server";

export const loaderQuery = <TQuery extends OperationType>(
  { context }: LoaderFunctionArgs,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  invariant(context.pothosContext.user);

  return getLoaderQuery(
    schema,
    json,
    defer,
    context.pothosContext,
  )<TQuery>(...rest);
};
