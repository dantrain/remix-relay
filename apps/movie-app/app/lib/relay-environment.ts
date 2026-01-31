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
import { getCachedResponse } from "@remix-relay/react";

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
              doc_id: params.id,
              variables,
            }),
          });

          const parts = await meros(response);

          // Check if it's a Response-like object (has .json method)
          if (parts && typeof (parts as Response).json === "function") {
            sink.next(await (parts as Response).json());
          } else {
            for await (const part of parts as AsyncIterable<{
              json: boolean;
              body: unknown;
            }>) {
              const data = part.json
                ? {
                    ...(part.body as object),
                    ...((part.body as { incremental?: object[] })
                      ?.incremental?.[0] ?? {}),
                  }
                : JSON.parse(part.body as string);
              sink.next(data);
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
