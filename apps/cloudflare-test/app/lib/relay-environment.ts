import { getCachedResponse } from "@remix-relay/react";
import { meros } from "meros/browser";
import type {
  CacheConfig,
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

const isServer = typeof document === "undefined";

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
) => {
  return (
    getCachedResponse(params, variables, cacheConfig) ??
    Observable.create((sink) => {
      const fetchGraphQL = async () => {
        try {
          const response = await fetch("/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "multipart/mixed; deferSpec=20220824, application/json",
            },
            body: JSON.stringify({
              query: params.text,
              variables,
            }),
          });

          const parts = await meros(response);

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
        } catch (err) {
          if (!isServer) {
            console.error(
              err instanceof Error ? err.message : "Something went wrong",
            );
          }

          throw err;
        } finally {
          sink.complete();
        }
      };

      setTimeout(() => fetchGraphQL(), 0);
    })
  );
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
