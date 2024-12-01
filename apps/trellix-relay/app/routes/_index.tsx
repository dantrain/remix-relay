import { graphql } from "react-relay";
import type { MetaFunction } from "react-router";
import { Suspense, useLoaderQuery } from "@remix-relay/react";
import BoardList from "~/components/BoardList";
import Header from "~/components/Header";
import LoadingScreen from "~/components/LoadingScreen";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";
import { Route } from ".react-router/types/app/routes/+types/_index";

const query = graphql`
  query IndexQuery {
    viewer {
      ...BoardListFragment @defer
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Trellix Relay" }];

export const loader = ({ context }: Route.LoaderArgs) =>
  loaderQuery(context, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function IndexPage() {
  const [data] = useLoaderQuery<IndexQuery>(query);

  return (
    <>
      <div className="fixed left-0 right-0 top-0">
        <Header />
      </div>
      <div
        className="flex min-h-[100dvh] justify-center overflow-y-auto pt-[74px]
          sm:pt-[90px]"
      >
        <Suspense fallback={<LoadingScreen />}>
          <main className="w-full max-w-7xl p-4 pt-5 sm:py-8">
            <h2 className="mb-4 text-lg font-bold uppercase text-slate-500">
              Your Boards
            </h2>

            <BoardList dataRef={data.viewer} />
          </main>
        </Suspense>
      </div>
    </>
  );
}
