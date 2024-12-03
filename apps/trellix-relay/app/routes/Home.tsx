import { graphql } from "react-relay";
import { Suspense, useLoaderQuery } from "@remix-relay/react";
import BoardList from "~/components/BoardList";
import LoadingScreen from "~/components/LoadingScreen";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { HomeQuery } from "./__generated__/HomeQuery.graphql";
import { Route } from ".react-router/types/app/routes/+types/Home";

const query = graphql`
  query HomeQuery {
    viewer {
      ...BoardListFragment @defer
    }
  }
`;

export const meta = () => [{ title: "Trellix Relay" }];

export const loader = ({ context }: Route.LoaderArgs) =>
  loaderQuery(context, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function HomePage() {
  const [data] = useLoaderQuery<HomeQuery>(query);

  return (
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
  );
}
