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
import {
  getCachedResponse,
  processMultipartResponse,
} from "@remix-relay/react";

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
              Accept: "multipart/mixed; incrementalSpec=v0.2, application/json",
            },
            body: JSON.stringify({
              doc_id: params.id,
              variables,
            }),
          });

          const parts = await meros(response);

          for await (const payload of processMultipartResponse(parts)) {
            sink.next(payload);
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

declare global {
  interface Window {
    __RELAY_ENVIRONMENT__?: Environment;
  }
}

export function getCurrentEnvironment() {
  if (typeof document === "undefined") {
    return createEnvironment();
  }

  if (!window.__RELAY_ENVIRONMENT__) {
    window.__RELAY_ENVIRONMENT__ = createEnvironment();
  }
  return window.__RELAY_ENVIRONMENT__;
}
