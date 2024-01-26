import { Suspense, useLoaderQuery } from "@remix-relay/react";
import { Button, Spinner } from "@remix-relay/ui";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import CounterList from "~/components/CounterList";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    viewer {
      ...CounterListFragment @defer
    }
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
      <div className="mb-8 mt-2 flex items-start justify-between">
        <h1 className="text-2xl font-bold">Counter App</h1>
        <Button asChild className="px-4">
          <a href="/auth/signout">Sign out</a>
        </Button>
      </div>
      <Suspense
        fallback={<Spinner className="animate-fade h-16 max-w-[260px]" />}
      >
        <CounterList dataRef={data.viewer} />
      </Suspense>
    </main>
  );
}
