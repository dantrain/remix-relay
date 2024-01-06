import type {
  ApolloServer,
  BaseContext,
  GraphQLExperimentalFormattedInitialIncrementalExecutionResult,
} from "@apollo/server";
import { TypedDeferredData, TypedResponse, defer, json } from "@remix-run/node";
import { FormattedExecutionResult } from "graphql";
import type {
  ConcreteRequest,
  GraphQLResponse,
  OperationType,
  RequestParameters,
  VariablesOf,
} from "relay-runtime";
import invariant from "tiny-invariant";

export type SerializablePreloadedQuery<TQuery extends OperationType> = {
  params: ConcreteRequest["params"];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse;
};

export async function loaderQuery<TQuery extends OperationType>(
  server: ApolloServer<BaseContext>,
  node: ConcreteRequest,
  variables: VariablesOf<TQuery>,
): Promise<
  | TypedResponse<{
      preloadedQuery: {
        params: RequestParameters;
        variables: VariablesOf<TQuery>;
        response: FormattedExecutionResult<
          Record<string, unknown>,
          { [key: string]: unknown }
        >;
      };
      deferredQueries: null;
    }>
  | TypedDeferredData<{
      preloadedQuery: {
        params: RequestParameters;
        variables: VariablesOf<TQuery>;
        response: GraphQLExperimentalFormattedInitialIncrementalExecutionResult<
          { [key: string]: unknown },
          { [key: string]: unknown }
        >;
      };
      deferredQueries: Promise<unknown>;
    }>
> {
  const result = await server.executeOperation(
    {
      query: node.params.text!,
      variables,
    },
    { contextValue: {} },
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
