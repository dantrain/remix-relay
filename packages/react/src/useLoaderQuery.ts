import { use, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import type {
  GraphQLTaggedNode,
  PreloadFetchPolicy,
  PreloadedQuery,
} from "react-relay";
import relay from "react-relay";
import type { useQueryLoaderHookType } from "react-relay/relay-hooks/useQueryLoader";
import { useLoaderData } from "react-router";
import type {
  ConcreteRequest,
  GraphQLResponse,
  OperationType,
  VariablesOf,
} from "relay-runtime";
import invariant from "tiny-invariant";
import { SetDeferredQueryContext } from "./deferred-query-context";
import { responseCache } from "./get-cached-response";

const { usePreloadedQuery, useQueryLoader, useRelayEnvironment } = relay;

export type SerializablePreloadedQuery<TQuery extends OperationType> = {
  params: ConcreteRequest["params"];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse;
};

export function useLoaderQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  fetchPolicy: PreloadFetchPolicy = "network-only",
): [
  TQuery["response"],
  useQueryLoaderHookType<TQuery>[1],
  useQueryLoaderHookType<TQuery>[2],
] {
  const loaderData = useLoaderData<
    () => Promise<
      | {
          preloadedQuery: SerializablePreloadedQuery<TQuery>;
          deferredQueries: Promise<SerializablePreloadedQuery<TQuery>[]>;
        }
      | { queryRef: PreloadedQuery<TQuery> }
    >
  >();

  const preloadedQuery =
    "preloadedQuery" in loaderData
      ? (loaderData.preloadedQuery as unknown as SerializablePreloadedQuery<TQuery>)
      : null;

  const deferredQueries =
    "deferredQueries" in loaderData
      ? (loaderData.deferredQueries as unknown as Promise<
          SerializablePreloadedQuery<TQuery>[]
        >)
      : null;

  const [deferredResult, setDeferredResult] = useState(preloadedQuery);

  const setDeferredQueries = use(SetDeferredQueryContext);

  useEffect(() => {
    if (deferredQueries) {
      setDeferredQueries(
        deferredQueries.then(async (deferredResults) => {
          deferredResults.forEach((result) => {
            flushSync(() => {
              setDeferredResult(
                result as unknown as SerializablePreloadedQuery<TQuery>,
              );
            });
          });

          return deferredResults;
        }),
      );
    }
  }, [deferredQueries, preloadedQuery, setDeferredQueries, setDeferredResult]);

  const environment = useRelayEnvironment();

  useMemo(() => {
    if (deferredResult) {
      writePreloadedQueryToCache(deferredResult);
    }
  }, [deferredResult]);

  let ref: PreloadedQuery<TQuery> | null =
    "queryRef" in loaderData
      ? (loaderData.queryRef as unknown as PreloadedQuery<TQuery>)
      : deferredResult
        ? {
            environment,
            fetchKey: `${
              deferredResult.params.id ?? deferredResult.params.cacheID
            }${simpleHash(deferredResult.response)}`,
            fetchPolicy,
            isDisposed: false,
            name: deferredResult.params.name,
            kind: "PreloadedQuery",
            variables: deferredResult.variables,
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

function writePreloadedQueryToCache<TQuery extends OperationType>(
  preloadedQueryObject: SerializablePreloadedQuery<TQuery>,
) {
  let cacheKey =
    preloadedQueryObject.params.id ?? preloadedQueryObject.params.cacheID;

  responseCache?.set(
    cacheKey,
    preloadedQueryObject.variables,
    preloadedQueryObject.response,
  );
}

function simpleHash(input: unknown): number {
  return JSON.stringify(input)
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
}
