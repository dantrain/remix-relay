import { graphql } from "react-relay";
import type { MetaFunction } from "react-router";
import { Deferred, useLoaderQuery } from "@remix-relay/react";
import { Button, Spinner } from "@remix-relay/ui";
import CounterList from "~/components/CounterList";
import { SignOutIcon } from "~/components/Icons";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";
import type { Route } from ".react-router/types/app/routes/+types/_index";

const query = graphql`
  query IndexQuery {
    viewer {
      ...CounterListFragment @defer
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: Route.LoaderArgs) =>
  loaderQuery<IndexQuery>(context, query, {});

export const clientLoader = () => clientLoaderQuery<IndexQuery>(query, {});

export default function Index() {
  const [data, refetch] = useLoaderQuery<IndexQuery>(query);

  useWindowVisible(() => refetch({}));

  return (
    <main>
      <div className="mb-8 mt-2 flex items-start justify-between">
        <h1 className="text-2xl font-bold">Counter App</h1>
        <Button asChild className="flex items-center gap-2 px-3">
          <a href="/auth/signout">
            <SignOutIcon />
            Sign out
          </a>
        </Button>
      </div>
      <Deferred
        fallback={<Spinner className="animate-fade h-16 max-w-[260px]" />}
      >
        <CounterList userRef={data.viewer} />
      </Deferred>
    </main>
  );
}
