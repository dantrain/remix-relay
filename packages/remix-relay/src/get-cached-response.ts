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

  const deferredFromCache: GraphQLResponse[] = [];

  for (let i = 0; ; i++) {
    const deferred = responseCache.get(`${cacheKey}-${i}`, variables);
    if (!deferred) break;
    deferredFromCache.push(deferred);
  }

  if (fromCache === null) {
    return null;
  }

  return Observable.create((sink) => {
    sink.next(fromCache);

    for (const deferred of deferredFromCache) {
      sink.next(deferred);
    }

    sink.complete();
  });
}
