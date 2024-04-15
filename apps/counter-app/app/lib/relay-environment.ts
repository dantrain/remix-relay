import { createId } from "@paralleldrive/cuid2";
import { Client, ExecutionResult, Sink, createClient } from "graphql-ws";
import { meros } from "meros/browser";
import type {
  CacheConfig,
  FetchFunction,
  PayloadData,
  RequestParameters,
  SubscribeFunction,
  Variables,
} from "relay-runtime";
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";
import { PayloadExtensions } from "relay-runtime/lib/network/RelayNetworkTypes";
import { toast } from "sonner";
import invariant from "tiny-invariant";
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
            toast.error(
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

const wsClient: Client | null = isServer
  ? null
  : createClient({
      url: `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
        window.location.host
      }/graphql`,
    });

const subscribeFn: SubscribeFunction = (operation, variables) => {
  return Observable.create((sink) => {
    invariant(operation.text);

    return wsClient?.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
        extensions: { tabId },
      },
      sink as Sink<ExecutionResult<PayloadData, PayloadExtensions>>,
    );
  });
};

const createEnvironment = () =>
  new Environment({
    network: Network.create(fetchFn, isServer ? undefined : subscribeFn),
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
