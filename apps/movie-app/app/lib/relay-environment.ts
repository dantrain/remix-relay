import { getCachedResponse } from "@repo/remix-relay";
import { meros } from "meros/browser";
import { trackPromise } from "react-promise-tracker";
import type {
  FetchFunction,
  RequestParameters,
  Variables,
} from "relay-runtime";
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
) => {
  console.log(getCachedResponse());

  return Observable.create((sink) => {
    setTimeout(
      () =>
        trackPromise(
          fetch("/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "multipart/mixed; deferSpec=20220824, application/json",
            },
            body: JSON.stringify({
              query: params.text,
              variables,
            }),
          })
            .then(meros)
            .then(async (parts) => {
              if (parts instanceof Response) {
                sink.next(await parts.json());
              } else {
                for await (const part of parts) {
                  sink.next({
                    ...part.body,
                    ...part.body?.incremental?.[0],
                  });
                }
              }

              sink.complete();
            }),
        ),
      0,
    );
  });
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
