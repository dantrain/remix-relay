import { Suspense, useLoaderQuery } from "@remix-relay/react";
import { Button, Spinner } from "@remix-relay/ui";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import CounterList from "~/components/CounterList";
import { SignOutIcon } from "~/components/Icons";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    viewer {
      ...CounterListFragment @defer
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery(context, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function Index() {
  const [data, refetch] = useLoaderQuery<IndexQuery>(query);

  useWindowVisible(() => refetch({}));

  return (
    <main>
      <div className="mb-8 mt-2 flex items-start justify-between">
        <h1 className="text-2xl font-bold">Counter App</h1>
        <Button asChild className="px-3">
          <a className="flex items-center gap-2" href="/auth/signout">
            <SignOutIcon />
            Sign out
          </a>
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
