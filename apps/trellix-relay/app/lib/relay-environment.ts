import { createId } from "@paralleldrive/cuid2";
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
import { trackPromise } from "~/components/Progress";

const isServer = typeof document === "undefined";
const tabId = isServer ? null : createId();

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
              extensions: { tabId },
            }),
          });

          if (response.status === 401 && !isServer) {
            window.location.href = "/signin";
            return;
          }

          const parts = await meros(response);

          if (parts instanceof Response) {
            const result = await parts.json();
            if (result.errors) {
              throw new Error(result.errors?.[0]?.message);
            }

            sink.next(result);
          } else {
            for await (const part of parts) {
              if (part.body.errors) {
                throw new Error(part.body.errors?.[0]?.message);
              }

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

      setTimeout(() => trackPromise(fetchGraphQL()), 0);
    })
  );
};

const createEnvironment = () =>
  new Environment({
    network: Network.create(fetchFn),
    store: new Store(RecordSource.create()),
    isServer,
  });

let environment: Environment;

export function getCurrentEnvironment() {
  if (typeof document === "undefined") {
    return createEnvironment();
  }

  return (environment ??= createEnvironment());
}
