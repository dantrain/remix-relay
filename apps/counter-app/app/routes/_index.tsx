import { useLoaderQuery } from "@remix-relay/react";
import { Button } from "@remix-relay/ui";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql, useMutation } from "react-relay";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";
import { IndexSetCountMutation } from "./__generated__/IndexSetCountMutation.graphql";

const query = graphql`
  query IndexQuery {
    counter {
      id
      count
    }
  }
`;

const mutation = graphql`
  mutation IndexSetCountMutation($count: Int!) {
    setCount(count: $count) {
      id
      count
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery<IndexQuery>(context, indexQueryNode, {});

export const clientLoader = () => clientLoaderQuery<IndexQuery>(query, {});

export default function Index() {
  const [
    {
      counter: { id, count },
    },
  ] = useLoaderQuery<IndexQuery>(query);

  const [commit] = useMutation<IndexSetCountMutation>(mutation);

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Counter App</h1>
      <div className="flex items-center gap-4">
        <Button
          className="px-4 pb-2 text-3xl"
          disabled={!count}
          onClick={() =>
            commit({
              variables: { count: Math.max(0, count - 1) },
              optimisticResponse: {
                setCount: { id, count: Math.max(0, count - 1) },
              },
            })
          }
        >
          -
        </Button>
        <pre className="min-w-[2ch] text-center text-5xl">{count}</pre>
        <Button
          className="px-4 pb-2 text-3xl"
          onClick={() =>
            commit({
              variables: { count: count + 1 },
              optimisticResponse: {
                setCount: { id, count: count + 1 },
              },
            })
          }
        >
          +
        </Button>
      </div>
    </main>
  );
}
