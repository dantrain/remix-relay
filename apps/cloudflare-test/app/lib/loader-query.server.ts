import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import {
  TypedDeferredData,
  TypedResponse,
  defer,
  json,
} from "@remix-run/cloudflare";
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
    | TypedResponse<{
        preloadedQuery: SerializablePreloadedQuery<
          TQuery,
          FormattedExecutionResult<TQuery["response"], PayloadExtensions>
        >;
        deferredQueries: null;
      }>
    | TypedDeferredData<{
        preloadedQuery: SerializablePreloadedQuery<TQuery, any>;
        deferredQueries: Promise<SerializablePreloadedQuery<TQuery, any>[]>;
      }>
  > => {
    invariant(isConcreteRequest(node), "Expected a ConcreteRequest");

    console.log("node", node);

    const document = parse(node.params.text!);

    const result = await executor({ document, variables, context });

    if (!(Symbol.asyncIterator in result)) {
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

    const initialResult = await result[Symbol.asyncIterator]().next();

    console.log("initialResult", initialResult);

    const preloadedQuery = {
      params: node.params,
      variables,
      response: initialResult.value,
    };

    const deferredQueries = (async () => {
      const chunks = [];

      for await (const chunk of result) {
        console.log("chunk", chunk);
        chunks.push(chunk);
      }

      return chunks.map((chunk, index) => ({
        params: {
          ...node.params,
          cacheID: `${node.params.id ?? node.params.cacheID}-${index}`,
        },
        variables,
        response: {
          hasNext: false,
          data: { slow: "Ride" },
          path: [""],
          label: "IndexQuery$defer$DeferTestFragment",
        },
      }));
    })();

    return defer({ preloadedQuery, deferredQueries });
  };
}

export const loaderQuery = getLoaderQuery(yoga);
