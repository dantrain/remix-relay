import { graphql } from "react-relay";
import { Deferred, useLoaderQuery } from "@remix-relay/react";
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
  loaderQuery<HomeQuery>(context, query, {});

export const clientLoader = () => clientLoaderQuery<HomeQuery>(query, {});

export default function HomePage() {
  const [data] = useLoaderQuery<HomeQuery>(query);

  return (
    <div
      className="flex min-h-dvh justify-center overflow-y-auto pt-[74px]
        sm:pt-[90px]"
    >
      <Deferred fallback={<LoadingScreen />}>
        <main
          className="w-full max-w-7xl p-4 pt-5
            pb-[calc(1rem+env(safe-area-inset-bottom))] sm:py-8"
        >
          <h2 className="mb-4 text-lg font-bold text-slate-500 uppercase">
            Your Boards
          </h2>

          <BoardList userRef={data.viewer} />
        </main>
      </Deferred>
    </div>
  );
}
