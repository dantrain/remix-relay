import { useLoaderQuery } from "@remix-relay/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import Counter from "~/components/Counter";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    counterConnection {
      edges {
        node {
          id
          ...CounterFragment
        }
      }
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery<IndexQuery>(context, indexQueryNode, {});

export const clientLoader = () => clientLoaderQuery<IndexQuery>(query, {});

export default function Index() {
  const [{ counterConnection }] = useLoaderQuery<IndexQuery>(query);

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Counter App</h1>
      <ul className="flex flex-col gap-5">
        {counterConnection.edges.map(({ node }) => (
          <li key={node.id}>
            <Counter dataRef={node} />
          </li>
        ))}
      </ul>
    </main>
  );
}
