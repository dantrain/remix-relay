import { execute } from "@graphql-tools/executor";
import {
  AppLoadContext,
  TypedDeferredData,
  TypedResponse,
  defer,
  json,
} from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import {
  FormattedExecutionResult,
  GraphQLSchema,
  InitialIncrementalExecutionResult,
  SubsequentIncrementalExecutionResult,
  parse,
} from "graphql";
import {
  ConcreteRequest,
  GraphQLTaggedNode,
  OperationType,
  RequestParameters,
  VariablesOf,
} from "relay-runtime";
import { PayloadExtensions } from "relay-runtime/lib/network/RelayNetworkTypes";
import invariant from "tiny-invariant";
import { PothosContext } from "~/schema/builder";
import { schema } from "~/schema/graphql-schema";
import * as dbSchema from "~/schema/db-schema";

type SerializablePreloadedQuery<TQuery extends OperationType, TResponse> = {
  params: RequestParameters;
  variables: VariablesOf<TQuery>;
  response: TResponse;
};

function isConcreteRequest(node: GraphQLTaggedNode): node is ConcreteRequest {
  return (node as ConcreteRequest).params !== undefined;
}

function getLoaderQuery<TContext>(schema: GraphQLSchema, context?: TContext) {
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

export const loaderQuery = <TQuery extends OperationType>(
  context: AppLoadContext,
  ...rest: Parameters<ReturnType<typeof getLoaderQuery>>
) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB, { schema: dbSchema });
  const loaderQuery = getLoaderQuery<PothosContext>(schema, { db });

  return loaderQuery<TQuery>(...rest);
};
