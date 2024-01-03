import type {
  FetchFunction,
  RequestParameters,
  Variables,
} from "relay-runtime";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
) => {
  return fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  }).then((response) => response.json());
};

const createEnvironment = () =>
  new Environment({
    network: Network.create(fetchFn),
    store: new Store(RecordSource.create()),
    isServer: typeof document === "undefined",
  });

let environment: Environment;

export function getCurrentEnvironment() {
  if (typeof document === "undefined") {
    return createEnvironment();
  }

  return (environment ??= createEnvironment());
}
