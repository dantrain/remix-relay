import { fetchQuery, loadQuery } from "react-relay";
import type {
  Environment,
  GraphQLTaggedNode,
  OperationType,
  VariablesOf,
} from "relay-runtime";

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
