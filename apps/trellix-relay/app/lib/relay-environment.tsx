import { createId } from "@paralleldrive/cuid2";
import { Client, ExecutionResult, Sink, createClient } from "graphql-ws";
import { TriangleAlertIcon } from "lucide-react";
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
import {
  getCachedResponse,
  processMultipartResponse,
} from "@remix-relay/react";
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
              Accept: "multipart/mixed; incrementalSpec=v0.2, application/json",
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

          for await (const payload of processMultipartResponse(parts)) {
            sink.next(payload);
          }
        } catch (err) {
          if (!isServer) {
            toast.error(
              err instanceof Error ? err.message : "Something went wrong",
              { icon: <TriangleAlertIcon className="w-5 text-red-700" /> },
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
