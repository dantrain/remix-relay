import {
  ExecutionResult,
  experimentalExecuteIncrementally,
  ExperimentalIncrementalExecutionResults,
  GraphQLSchema,
  InitialIncrementalExecutionResult,
  IncrementalDeferResult,
  parse,
} from "graphql";
import type {
  ConcreteRequest,
  GraphQLTaggedNode,
  OperationType,
  RequestParameters,
  VariablesOf,
} from "relay-runtime";
import { PayloadExtensions } from "relay-runtime/lib/network/RelayNetworkTypes";
import { invariant } from "./invariant";

// PendingResult is not exported from graphql, so we define it here
interface PendingResult {
  id: string;
  path: ReadonlyArray<string | number>;
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

function isConcreteRequest(node: GraphQLTaggedNode): node is ConcreteRequest {
  return (node as ConcreteRequest).params !== undefined;
}

function isIncrementalResult<TData>(
  result:
    | ExecutionResult<TData>
    | ExperimentalIncrementalExecutionResults<TData>,
): result is ExperimentalIncrementalExecutionResults<TData> {
  return "initialResult" in result;
}

export type SerializablePreloadedQuery<
  TQuery extends OperationType,
  TResponse,
> = {
  params: RequestParameters;
  variables: VariablesOf<TQuery>;
  response: TResponse;
};

export type LoaderQueryArgs<TQuery extends OperationType> = [
  node: GraphQLTaggedNode,
  variables: VariablesOf<TQuery>,
];

// Response format for deferred chunks - includes path for Relay compatibility
type DeferredResponse<TData = unknown, TExtensions = unknown> = {
  hasNext: boolean;
  data?: TData;
  path?: ReadonlyArray<string | number>;
  label?: string;
  extensions?: TExtensions;
};

export type DeferredChunkNode<TQuery extends OperationType> = {
  data: SerializablePreloadedQuery<
    TQuery,
    DeferredResponse<TQuery["response"], PayloadExtensions>
  >;
  next: Promise<DeferredChunkNode<TQuery> | null>;
};

type LoaderQuery = <TQuery extends OperationType>(
  ...args: LoaderQueryArgs<TQuery>
) => Promise<
  | {
      preloadedQuery: SerializablePreloadedQuery<
        TQuery,
        ExecutionResult<TQuery["response"], PayloadExtensions>
      >;
      deferredChunk: null;
    }
  | {
      preloadedQuery: SerializablePreloadedQuery<
        TQuery,
        InitialIncrementalExecutionResult<TQuery["response"], PayloadExtensions>
      >;
      deferredChunk: Promise<DeferredChunkNode<TQuery> | null>;
    }
>;

export const getLoaderQuery = <TContext>(
  schema: GraphQLSchema,
  context?: TContext,
  queryMap?: Record<string, string>,
): LoaderQuery => {
  return async <TQuery extends OperationType>(
    ...args: LoaderQueryArgs<TQuery>
  ) => {
    const [node, variables] = args;
    invariant(isConcreteRequest(node), "Expected a ConcreteRequest");

    const queryString =
      node.params.text ?? (node.params.id && queryMap?.[node.params.id]);

    invariant(queryString, "Expected a query string");

    const document = parse(queryString);

    const result = await experimentalExecuteIncrementally({
      schema,
      document,
      variableValues: variables,
      contextValue: context,
      enableEarlyExecution: true,
    });

    if (!isIncrementalResult(result)) {
      if (result.errors?.length) {
        throw new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      }

      const preloadedQuery = {
        params: node.params,
        variables,
        response: result,
      };

      return { preloadedQuery, deferredChunk: null };
    }

    const preloadedQuery = {
      params: node.params,
      variables,
      response: result.initialResult,
    };

    // Track pending items by id to resolve paths
    const pendingById = new Map<string, PendingResult>();

    for (const pending of result.initialResult.pending) {
      pendingById.set(pending.id, pending);
    }

    // Build a linked-promise chain: each node resolves as its data arrives
    let resolveHead: (value: DeferredChunkNode<TQuery> | null) => void;
    let rejectHead: (reason: unknown) => void;

    const headPromise = new Promise<DeferredChunkNode<TQuery> | null>(
      (resolve, reject) => {
        resolveHead = resolve;
        rejectHead = reject;
      },
    );

    let resolveCurrent = resolveHead!;
    let rejectCurrent = rejectHead!;
    let chunkIndex = 0;

    // Fire-and-forget async iteration
    (async () => {
      try {
        for await (const chunk of result.subsequentResults) {
          // Track any new pending items
          if (chunk.pending) {
            for (const pending of chunk.pending) {
              pendingById.set(pending.id, pending);
            }
          }

          // Process incremental results
          if (chunk.incremental) {
            for (const inc of chunk.incremental) {
              const pending = pendingById.get(inc.id);
              const basePath = pending?.path ?? [];
              const subPath = (inc as IncrementalDeferResult).subPath ?? [];
              const fullPath = [...basePath, ...subPath];

              const incData = (inc as IncrementalDeferResult).data as Record<
                string,
                unknown
              >;

              // Merge all parent fields so overlapping fields (already sent in
              // the initial response) are present for Relay's normalizer.
              const parentData = getAtPath(
                result.initialResult.data as Record<string, unknown>,
                fullPath,
              );

              const mergedData = parentData
                ? { ...parentData, ...incData }
                : incData;

              const transformed: DeferredResponse<
                TQuery["response"],
                PayloadExtensions
              > = {
                hasNext: chunk.hasNext,
                data: mergedData as TQuery["response"],
                path: fullPath,
                label: pending?.label,
              };

              const currentIndex = chunkIndex++;

              // Create next link in the chain
              let resolveNext: (
                value: DeferredChunkNode<TQuery> | null,
              ) => void;

              let rejectNext: (reason: unknown) => void;

              const nextPromise = new Promise<DeferredChunkNode<TQuery> | null>(
                (resolve, reject) => {
                  resolveNext = resolve;
                  rejectNext = reject;
                },
              );

              // Resolve the current link
              resolveCurrent({
                data: {
                  params: {
                    ...node.params,
                    cacheID: `${node.params.id ?? node.params.cacheID}-${currentIndex}`,
                  } as RequestParameters,
                  variables,
                  response: transformed,
                },
                next: nextPromise,
              });

              resolveCurrent = resolveNext!;
              rejectCurrent = rejectNext!;
            }
          }
        }

        // Iteration complete - terminate the chain
        resolveCurrent(null);
      } catch (error) {
        rejectCurrent(error);
      }
    })();

    return { preloadedQuery, deferredChunk: headPromise };
  };
};
