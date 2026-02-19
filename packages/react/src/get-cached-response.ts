import type {
  CacheConfig,
  GraphQLResponse,
  RequestParameters,
  Variables,
} from "relay-runtime";
import { Observable, QueryResponseCache } from "relay-runtime";

export const responseCache: QueryResponseCache = new QueryResponseCache({
  size: 100,
  ttl: 5000,
});

// Module-level store for pending deferred promise chains
const pendingDeferredStore = new Map<
  string,
  Promise<{
    data: { response: GraphQLResponse };
    next: Promise<unknown>;
  } | null>
>();

export function storePendingDeferred(
  cacheKey: string,
  headPromise: Promise<unknown>,
) {
  pendingDeferredStore.set(
    cacheKey,
    headPromise as Promise<{
      data: { response: GraphQLResponse };
      next: Promise<unknown>;
    } | null>,
  );
}

export function clearPendingDeferred(cacheKey: string) {
  pendingDeferredStore.delete(cacheKey);
}

export function getCachedResponse(
  params: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
) {
  const isQuery = params.operationKind === "query";
  const cacheKey = params.id ?? params.cacheID;
  const forceFetch = cacheConfig && cacheConfig.force;

  if (responseCache === null || !isQuery || forceFetch) {
    return null;
  }

  const fromCache = responseCache.get(cacheKey, variables);

  if (fromCache === null) {
    return null;
  }

  const headPromise = pendingDeferredStore.get(cacheKey);

  if (headPromise) {
    // Consume once
    pendingDeferredStore.delete(cacheKey);

    return Observable.create((sink) => {
      // Emit initial response synchronously
      sink.next(fromCache);

      // Follow the linked-promise chain
      (async () => {
        try {
          let current = await headPromise;

          while (current !== null) {
            sink.next(current.data.response as GraphQLResponse);
            current = (await current.next) as typeof current;
          }

          sink.complete();
        } catch (error) {
          sink.error(error instanceof Error ? error : new Error(String(error)));
        }
      })();
    });
  }

  // Fallback: check for already-cached deferred chunks
  const deferredFromCache: GraphQLResponse[] = [];

  for (let i = 0; ; i++) {
    const deferred = responseCache.get(`${cacheKey}-${i}`, variables);
    if (!deferred) break;
    deferredFromCache.push(deferred);
  }

  return Observable.create((sink) => {
    sink.next(fromCache);

    for (const deferred of deferredFromCache) {
      sink.next(deferred);
    }

    sink.complete();
  });
}
