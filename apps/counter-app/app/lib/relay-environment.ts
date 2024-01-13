import { getCachedResponse } from "@remix-relay/react";
import { Client, ExecutionResult, Sink, createClient } from "graphql-ws";
import { meros } from "meros/browser";
import { trackPromise } from "react-promise-tracker";
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
import invariant from "tiny-invariant";

const isServer = typeof document === "undefined";

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
) => {
  return (
    getCachedResponse(params, variables, cacheConfig) ??
    Observable.create((sink) => {
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
    })
  );
};

const wsClient: Client | null = isServer
  ? null
  : createClient({
      url: "ws://localhost:3000",
    });

const subscribeFn: SubscribeFunction = (operation, variables) => {
  return Observable.create((sink) => {
    invariant(operation.text);

    return wsClient?.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
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