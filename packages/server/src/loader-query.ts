import type {
  ApolloServer,
  BaseContext,
  GraphQLExperimentalFormattedInitialIncrementalExecutionResult,
  GraphQLExperimentalFormattedSubsequentIncrementalExecutionResult,
} from "@apollo/server";
import { TypedDeferredData, TypedResponse, defer, json } from "@remix-run/node";
import { FormattedExecutionResult } from "graphql";
import type {
  ConcreteRequest,
  OperationType,
  RequestParameters,
  VariablesOf,
} from "relay-runtime";
import { PayloadExtensions } from "relay-runtime/lib/network/RelayNetworkTypes";
import invariant from "tiny-invariant";

export type SerializablePreloadedQuery<
  TQuery extends OperationType,
  TResponse,
> = {
  params: RequestParameters;
  variables: VariablesOf<TQuery>;
  response: TResponse;
};

export function getLoaderQuery(
  server: ApolloServer<BaseContext>,
  context: BaseContext = {},
) {
  return async <TQuery extends OperationType>(
    node: ConcreteRequest,
    variables: VariablesOf<TQuery>,
  ) => {
    try {
      server.assertStarted("Server not started");
    } catch (e) {
      await server.start();
    }

    return loaderQuery(server, node, variables, context);
  };
}

export async function loaderQuery<TQuery extends OperationType>(
  server: ApolloServer<BaseContext>,
  node: ConcreteRequest,
  variables: VariablesOf<TQuery>,
  context: BaseContext = {},
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
        GraphQLExperimentalFormattedInitialIncrementalExecutionResult<
          TQuery["response"],
          PayloadExtensions
        >
      >;
      deferredQueries: Promise<
        SerializablePreloadedQuery<
          TQuery,
          GraphQLExperimentalFormattedSubsequentIncrementalExecutionResult<
            TQuery["response"],
            PayloadExtensions
          >
        >[]
      >;
    }>
> {
  const result = await server.executeOperation(
    {
      query: node.params.text!,
      variables,
    },
    { contextValue: context },
  );

  if (result.body.kind === "single") {
    if (result.body.singleResult.errors?.length) {
      throw new Response(null, {
        status: 404,
        statusText: "Not Found",
      });
    }

    const preloadedQuery = {
      params: node.params,
      variables,
      response: result.body.singleResult,
    };

    return json({ preloadedQuery, deferredQueries: null });
  }

  const preloadedQuery = {
    params: node.params,
    variables,
    response: result.body.initialResult,
  };

  const deferredQueries = (async () => {
    invariant(result.body.kind === "incremental");

    const chunks = [];

    for await (const chunk of result.body.subsequentResults) {
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
}
