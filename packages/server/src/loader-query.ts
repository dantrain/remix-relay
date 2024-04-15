import { execute } from "@graphql-tools/executor";
import type { TypedDeferredData, TypedResponse } from "@remix-run/node";
import type {
  DeferFunction,
  JsonFunction,
} from "@remix-run/server-runtime/dist/responses";
import {
  FormattedExecutionResult,
  GraphQLSchema,
  InitialIncrementalExecutionResult,
  SubsequentIncrementalExecutionResult,
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

function isConcreteRequest(node: GraphQLTaggedNode): node is ConcreteRequest {
  return (node as ConcreteRequest).params !== undefined;
}

export type SerializablePreloadedQuery<
  TQuery extends OperationType,
  TResponse,
> = {
  params: RequestParameters;
  variables: VariablesOf<TQuery>;
  response: TResponse;
};

export function getLoaderQuery<TContext>(
  schema: GraphQLSchema,
  json: JsonFunction,
  defer: DeferFunction,
  context?: TContext,
) {
  return async <TQuery extends OperationType>(
    node: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>,
  ): Promise<
    | TypedResponse<{
        preloadedQuery: SerializablePreloadedQuery<
          TQuery,
          FormattedExecutionResult<TQuery["response"], PayloadExtensions>
        >;
        deferredQueries: null;
      }>
    | TypedDeferredData<{
        preloadedQuery: SerializablePreloadedQuery<
          TQuery,
          InitialIncrementalExecutionResult<
            TQuery["response"],
            PayloadExtensions
          >
        >;
        deferredQueries: Promise<
          SerializablePreloadedQuery<
            TQuery,
            SubsequentIncrementalExecutionResult<
              TQuery["response"],
              PayloadExtensions
            >
          >[]
        >;
      }>
  > => {
    invariant(isConcreteRequest(node), "Expected a ConcreteRequest");

    const document = parse(node.params.text!);

    const result = await execute<TQuery["response"], PayloadExtensions>({
      schema,
      document,
      variableValues: variables,
      contextValue: context,
    });

    if (!("initialResult" in result)) {
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

      return json({ preloadedQuery, deferredQueries: null });
    }

    const preloadedQuery = {
      params: node.params,
      variables,
      response: result.initialResult,
    };

    const deferredQueries = (async () => {
      const chunks = [];

      for await (const chunk of result.subsequentResults) {
        chunks.push(chunk);
      }

      return chunks.map(({ incremental, ...rest }, index) => ({
        params: {
          ...node.params,
          cacheID: `${node.params.id ?? node.params.cacheID}-${index}`,
        },
        variables,
        response: { ...rest, ...incremental?.[0] },
      }));
    })();

    return defer({ preloadedQuery, deferredQueries });
  };
}
