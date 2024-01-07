import { fetchQuery, loadQuery } from "react-relay";
import type {
  Environment,
  GraphQLTaggedNode,
  OperationType,
  VariablesOf,
} from "relay-runtime";

export function getClientLoaderQuery(environment: Environment) {
  return async <TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>,
  ) => clientLoaderQuery(environment, query, variables);
}

export async function clientLoaderQuery<TQuery extends OperationType>(
  environment: Environment,
  query: GraphQLTaggedNode,
  variables: VariablesOf<TQuery>,
) {
  const data = await fetchQuery<TQuery>(environment, query, variables, {
    fetchPolicy: "store-or-network",
  }).toPromise();

  const queryRef = loadQuery<TQuery>(environment, query, variables, {
    fetchPolicy: "store-only",
  });

  return { queryRef, data };
}
