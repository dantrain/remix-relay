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
import { getCachedResponse } from "@remix-relay/react";
import { trackPromise } from "~/components/Progress";

const isServer = typeof document === "undefined";
const tabId = isServer ? null : createId();

// Types for new June 2023 incremental delivery format
interface PendingResult {
  id: string;
  path: ReadonlyArray<string | number>;
  label?: string;
}

interface IncrementalResult {
  id: string;
  data?: Record<string, unknown>;
  items?: unknown[];
  subPath?: ReadonlyArray<string | number>;
  errors?: unknown[];
}

interface IncrementalResponse {
  data?: Record<string, unknown>;
  pending?: PendingResult[];
  incremental?: IncrementalResult[];
  completed?: { id: string }[];
  hasNext?: boolean;
  errors?: { message: string }[];
  // Old format fields
  path?: ReadonlyArray<string | number>;
  label?: string;
}

// Helper to get an object at a given path in the data tree
function getAtPath(
  data: Record<string, unknown>,
  path: ReadonlyArray<string | number>,
): Record<string, unknown> | undefined {
  let current: unknown = data;
  for (const key of path) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current as Record<string, unknown> | undefined;
}

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
) => {
  return (
    getCachedResponse(params, variables, cacheConfig) ??
    Observable.create((sink) => {
      const fetchGraphQL = async () => {
        // Track pending items by id for new format
        const pendingById = new Map<string, PendingResult>();
        // Store initial data for merging id into incremental results
        let initialData: Record<string, unknown> | undefined;

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

          if (parts instanceof Response) {
            const result = await parts.json();
            if (result.errors) {
              throw new Error(result.errors?.[0]?.message);
            }

            sink.next(result);
          } else {
            for await (const part of parts) {
              const body = part.body as IncrementalResponse;

              if (body.errors) {
                throw new Error(body.errors?.[0]?.message);
              }

              // Check if this is new format (has pending array)
              if (body.pending) {
                // Track pending items for later path resolution
                for (const pending of body.pending) {
                  pendingById.set(pending.id, pending);
                }
              }

              // Handle incremental results
              if (body.incremental && body.incremental.length > 0) {
                for (const inc of body.incremental) {
                  // Support both old format (path directly on inc) and new format (id + pending lookup)
                  type OldFormatInc = IncrementalResult & {
                    path?: ReadonlyArray<string | number>;
                    label?: string;
                  };
                  const oldInc = inc as OldFormatInc;

                  let fullPath: ReadonlyArray<string | number>;
                  let label: string | undefined;

                  if (oldInc.path !== undefined) {
                    // Old format - path and label are directly on the incremental result
                    fullPath = oldInc.path;
                    label = oldInc.label;
                  } else {
                    // New format - look up path from pending by id
                    const pending = pendingById.get(inc.id);
                    const basePath = pending?.path ?? [];
                    const subPath = inc.subPath ?? [];
                    fullPath = [...basePath, ...subPath];
                    label = pending?.label;
                  }

                  // Relay needs the parent object's `id` to properly normalize deferred data.
                  // GraphQL-js de-duplicates fields, so `id` may only be in the initial response.
                  // We merge the parent's `id` from the initial data into the incremental result.
                  let mergedData = inc.data;
                  if (initialData && inc.data) {
                    const parentData = getAtPath(initialData, fullPath);
                    if (parentData?.id !== undefined && !("id" in inc.data)) {
                      mergedData = { id: parentData.id, ...inc.data };
                    }
                  }

                  // Transform to Relay-compatible format with path
                  sink.next({
                    data: mergedData,
                    path: [...fullPath],
                    label,
                    hasNext: body.hasNext,
                  } as Parameters<typeof sink.next>[0]);
                }
              } else if (body.data !== undefined) {
                // Initial response - store data for later id merging
                initialData = body.data;
                // Pass through to Relay
                sink.next(body as Parameters<typeof sink.next>[0]);
              } else if (body.path !== undefined) {
                // Old format incremental result - pass through
                sink.next(body as Parameters<typeof sink.next>[0]);
              }
            }
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
