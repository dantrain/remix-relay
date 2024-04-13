import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { TypedResponse, json } from "@remix-run/cloudflare";
import { FormattedExecutionResult, parse } from "graphql";
import type { YogaServerInstance } from "graphql-yoga";
import {
  ConcreteRequest,
  GraphQLTaggedNode,
  OperationType,
  RequestParameters,
  VariablesOf,
} from "relay-runtime";
import { PayloadExtensions } from "relay-runtime/lib/network/RelayNetworkTypes";
import invariant from "tiny-invariant";
import { yoga } from "./yoga";

type SerializablePreloadedQuery<TQuery extends OperationType, TResponse> = {
  params: RequestParameters;
  variables: VariablesOf<TQuery>;
  response: TResponse;
};

function isConcreteRequest(node: GraphQLTaggedNode): node is ConcreteRequest {
  return (node as ConcreteRequest).params !== undefined;
}

function assertSingleValue<TValue extends object>(
  value: TValue | AsyncIterable<TValue>,
): asserts value is TValue {
  if (Symbol.asyncIterator in value) {
    throw new Error("Expected single value");
  }
}

function getLoaderQuery<
  TServerContext extends Record<string, unknown>,
  TUserContext extends Record<string, unknown>,
>(
  server: YogaServerInstance<TServerContext, TUserContext>,
  context?: TServerContext,
) {
  const executor = buildHTTPExecutor({
    fetch: server.fetch,
  });

  return async <TQuery extends OperationType>(
    node: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>,
  ): Promise<
    TypedResponse<{
      preloadedQuery: SerializablePreloadedQuery<
        TQuery,
        FormattedExecutionResult<TQuery["response"], PayloadExtensions>
      >;
      deferredQueries: null;
    }>
  > => {
    invariant(isConcreteRequest(node), "Expected a ConcreteRequest");

    const document = parse(node.params.text!);

    const result = await executor({ document, variables, context });

    assertSingleValue(result);

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
  };
}

export const loaderQuery = getLoaderQuery(yoga);
