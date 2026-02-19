import { useMemo } from "react";
import type {
  GraphQLTaggedNode,
  PreloadFetchPolicy,
  PreloadedQuery,
} from "react-relay";
import relay from "react-relay";
import type { useQueryLoaderHookType } from "react-relay/relay-hooks/useQueryLoader";
import { useLoaderData, useRouteLoaderData } from "react-router";
import type {
  ConcreteRequest,
  GraphQLResponse,
  OperationType,
  RequestParameters,
  VariablesOf,
} from "relay-runtime";
import { responseCache, storePendingDeferred } from "./get-cached-response";
import { invariant } from "./invariant";

const { usePreloadedQuery, useQueryLoader, useRelayEnvironment } = relay;

export type SerializablePreloadedQuery<TQuery extends OperationType> = {
  params: ConcreteRequest["params"];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse;
};

type DeferredChunkNode<TQuery extends OperationType> = {
  data: SerializablePreloadedQuery<TQuery>;
  next: Promise<DeferredChunkNode<TQuery> | null>;
};

type LoaderData<TQuery extends OperationType> =
  | {
      preloadedQuery: SerializablePreloadedQuery<TQuery>;
      deferredChunk: Promise<DeferredChunkNode<TQuery> | null> | null;
    }
  | { queryRef: PreloadedQuery<TQuery> };

function useCommonLoaderQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  fetchPolicy: PreloadFetchPolicy,
  loaderData: LoaderData<TQuery>,
): [
  TQuery["response"],
  useQueryLoaderHookType<TQuery>[1],
  useQueryLoaderHookType<TQuery>[2],
] {
  const preloadedQuery =
    "preloadedQuery" in loaderData
      ? (loaderData.preloadedQuery as unknown as SerializablePreloadedQuery<TQuery>)
      : null;

  const deferredChunk =
    "deferredChunk" in loaderData
      ? (loaderData.deferredChunk as Promise<DeferredChunkNode<TQuery> | null> | null)
      : null;

  const environment = useRelayEnvironment();

  useMemo(() => {
    if (preloadedQuery) {
      writePreloadedQueryToCache(preloadedQuery);

      if (deferredChunk) {
        const cacheKey =
          preloadedQuery.params.id ?? preloadedQuery.params.cacheID;

        if (cacheKey) {
          storePendingDeferred(cacheKey, deferredChunk);
        }
      }
    }
  }, [preloadedQuery, deferredChunk]);

  let ref: PreloadedQuery<TQuery> | null =
    "queryRef" in loaderData
      ? (loaderData.queryRef as unknown as PreloadedQuery<TQuery>)
      : preloadedQuery
        ? {
            environment,
            fetchKey: preloadedQuery.params.id ?? preloadedQuery.params.cacheID,
            fetchPolicy,
            isDisposed: false,
            name: preloadedQuery.params.name,
            kind: "PreloadedQuery",
            variables: preloadedQuery.variables,
            dispose: () => {},
          }
        : null;

  invariant(ref, "Missing queryRef");

  const [queryRef, loadQuery, disposeQuery] = useQueryLoader<TQuery>(query);

  if (queryRef) ref = queryRef;

  const reloadQuery: typeof loadQuery = (
    variables,
    options = { fetchPolicy: "store-and-network" },
  ) => loadQuery(variables, options);

  const data = usePreloadedQuery<TQuery>(query, ref);

  return [data, reloadQuery, disposeQuery];
}

export function useLoaderQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  fetchPolicy: PreloadFetchPolicy = "network-only",
) {
  const loaderData: LoaderData<TQuery> = useLoaderData();

  return useCommonLoaderQuery(query, fetchPolicy, loaderData);
}

export function useRouteLoaderQuery<TQuery extends OperationType>(
  routeId: string,
  query: GraphQLTaggedNode,
  fetchPolicy: PreloadFetchPolicy = "network-only",
) {
  const loaderData: LoaderData<TQuery> | undefined =
    useRouteLoaderData(routeId);

  invariant(loaderData, `Missing loader data for routeId ${routeId}`);

  return useCommonLoaderQuery(query, fetchPolicy, loaderData);
}

function writePreloadedQueryToCache<TQuery extends OperationType>(
  preloadedQueryObject: SerializablePreloadedQuery<TQuery>,
) {
  const params = preloadedQueryObject.params as RequestParameters & {
    cacheID?: string;
  };

  const cacheKey = params.cacheID ?? params.id;
  invariant(cacheKey, "Missing cacheKey");

  responseCache?.set(
    cacheKey,
    preloadedQueryObject.variables,
    preloadedQueryObject.response,
  );
}
