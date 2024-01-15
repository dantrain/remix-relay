import { useLoaderQuery } from "@remix-relay/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import CounterList from "~/components/CounterList";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    ...CounterListFragment
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery<IndexQuery>(context, indexQueryNode, {});

export const clientLoader = () => clientLoaderQuery<IndexQuery>(query, {});

export default function Index() {
  const [data, reload] = useLoaderQuery<IndexQuery>(query);

  useWindowVisible(() => reload({}));

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Counter App</h1>
      <CounterList dataRef={data} />
    </main>
  );
}
