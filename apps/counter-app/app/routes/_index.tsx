import { useLoaderQuery } from "@remix-relay/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import Counter from "~/components/Counter";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    counters {
      id
      ...CounterFragment
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery<IndexQuery>(context, indexQueryNode, {});

export const clientLoader = () => clientLoaderQuery<IndexQuery>(query, {});

export default function Index() {
  const [{ counters }] = useLoaderQuery<IndexQuery>(query);

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Counter App</h1>
      <ul className="flex flex-col gap-5">
        {counters.map((counter) => (
          <li className="flex items-center gap-4" key={counter.id}>
            <Counter dataRef={counter} />
          </li>
        ))}
      </ul>
    </main>
  );
}
