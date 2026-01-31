import type {
  GraphQLTaggedNode,
  OperationType,
  VariablesOf,
} from "relay-runtime";
import { clientLoaderQuery as baseClientLoaderQuery } from "@remix-relay/react";
import { getCurrentEnvironment } from "./relay-environment";

export async function clientLoaderQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  variables: VariablesOf<TQuery>,
) {
  return baseClientLoaderQuery<TQuery>(
    getCurrentEnvironment(),
    query,
    variables,
  );
}
