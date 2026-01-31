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
import invariant from "tiny-invariant";

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

type LoaderQuery = <TQuery extends OperationType>(
  ...args: LoaderQueryArgs<TQuery>
) => Promise<
  | {
      preloadedQuery: SerializablePreloadedQuery<
        TQuery,
        ExecutionResult<TQuery["response"], PayloadExtensions>
      >;
      deferredQueries: null;
    }
  | {
      preloadedQuery: SerializablePreloadedQuery<
        TQuery,
        InitialIncrementalExecutionResult<TQuery["response"], PayloadExtensions>
      >;
      deferredQueries: Promise<
        SerializablePreloadedQuery<
          TQuery,
          DeferredResponse<TQuery["response"], PayloadExtensions>
        >[]
      >;
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

      return { preloadedQuery, deferredQueries: null };
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

    const deferredQueries = (async () => {
      const chunks: DeferredResponse<TQuery["response"], PayloadExtensions>[] =
        [];

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
            // Get the pending item to resolve the path
            const pending = pendingById.get(inc.id);
            const basePath = pending?.path ?? [];
            const subPath = (inc as IncrementalDeferResult).subPath ?? [];
            const fullPath = [...basePath, ...subPath];

            // Get the incremental data
            const incData = (inc as IncrementalDeferResult).data as Record<
              string,
              unknown
            >;

            // Relay needs the parent object's `id` to properly normalize deferred data.
            // GraphQL-js de-duplicates fields, so `id` may only be in the initial result.
            // We merge the parent's `id` from the initial data into the incremental result.
            const parentData = getAtPath(
              result.initialResult.data as Record<string, unknown>,
              fullPath,
            );
            const mergedData =
              parentData?.id !== undefined
                ? { id: parentData.id, ...incData }
                : incData;

            // Transform to Relay-compatible format with path
            const transformed: DeferredResponse<
              TQuery["response"],
              PayloadExtensions
            > = {
              hasNext: chunk.hasNext,
              data: mergedData as TQuery["response"],
              path: fullPath,
              label: pending?.label,
            };

            chunks.push(transformed);
          }
        }
      }

      return chunks.map((response, index) => ({
        params: {
          ...node.params,
          cacheID: `${node.params.id ?? node.params.cacheID}-${index}`,
        },
        variables,
        response,
      }));
    })();

    return { preloadedQuery, deferredQueries };
  };
};
