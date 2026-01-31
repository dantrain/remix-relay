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
              const body = part.json
                ? (part.body as IncrementalResponse)
                : (JSON.parse(part.body as string) as IncrementalResponse);

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
