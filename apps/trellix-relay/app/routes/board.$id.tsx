import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Params, useParams } from "@remix-run/react";
import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { graphql } from "react-relay";
import { Suspense, metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Board } from "~/components/Board";
import { BoardTitle } from "~/components/BoardTitle";
import Header from "~/components/Header";
import { Spinner } from "~/components/Spinner";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { ViewerIdContext } from "~/lib/viewer-id-context";
import { boardQuery } from "./__generated__/boardQuery.graphql";

const query = graphql`
  query boardQuery($id: ID!) {
    viewer {
      id
    }
    board(id: $id) {
      id
      title
      ...BoardTitleFragment @defer
      ...BoardFragment @defer
    }
  }
`;

export const meta = metaQuery<boardQuery>(({ data }) => [
  { title: `${data.board.title} | Trellix Relay` },
]);

const getVars = (params: Params<string>) => ({ id: params.id ?? "" });

export const loader = ({ context, params }: LoaderFunctionArgs) =>
  loaderQuery<boardQuery>(context, query, getVars(params));

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) =>
  clientLoaderQuery<boardQuery>(query, getVars(params));

export default function BoardPage() {
  const params = useParams();
  const [{ viewer, board }, refetch] = useLoaderQuery<boardQuery>(query);

  useWindowVisible(() => refetch({ id: exists(params.id) }));

  return (
    <ViewerIdContext.Provider value={fromGlobalId(viewer.id)}>
      <div className="fixed left-0 right-0 top-0 z-30">
        <Header />
      </div>
      <main
        className="flex h-[100dvh] flex-col items-center pt-[74px] sm:pt-[90px]"
      >
        <Suspense
          fallback={
            <div className="animate-fade mt-12 flex justify-center">
              <Spinner />
            </div>
          }
        >
          <div
            className="flex min-w-[min(100dvw,1280px)] max-w-[100dvw] flex-1
              flex-col overflow-x-auto"
          >
            <div className="self-start px-2 pt-3 sm:px-4 sm:pt-5">
              <BoardTitle dataRef={board} />
            </div>
            <Board dataRef={board} />
          </div>
        </Suspense>
      </main>
    </ViewerIdContext.Provider>
  );
}
