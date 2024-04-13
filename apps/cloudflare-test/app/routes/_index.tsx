import { useLoaderQuery } from "@remix-relay/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { parse } from "graphql";
import { GraphQLTaggedNode, graphql } from "react-relay";
import { ConcreteRequest } from "relay-runtime";
import invariant from "tiny-invariant";
import { executor } from "~/lib/yoga";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

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

const query = graphql`
  query IndexQuery {
    hello
  }
`;

export const meta: MetaFunction = () => {
  return [{ title: "Cloudflare Test" }];
};

export const loader: LoaderFunction = async () => {
  const node = query;
  const variables = {};

  invariant(isConcreteRequest(node), "Expected a ConcreteRequest");

  const document = parse(node.params.text!);

  const result = await executor({ document });

  assertSingleValue(result);

  const preloadedQuery = {
    params: node.params,
    variables,
    response: result,
  };

  return json({ preloadedQuery, deferredQueries: null });
};

export default function Index() {
  const [data] = useLoaderQuery<IndexQuery>(query);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix (with Vite and Cloudflare)</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}
