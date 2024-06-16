import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Params } from "@remix-run/react";
import { fromGlobalId } from "lib/global-id";
import { graphql } from "react-relay";
import { metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Board } from "~/components/Board";
import { BoardTitle } from "~/components/BoardTitle";
import Header from "~/components/Header";
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
      name
      ...BoardTitleFragment
      ...BoardFragment
    }
  }
`;

export const meta = metaQuery<boardQuery>(({ data }) => [
  { title: `${data.board.name} | Trellix Relay` },
]);

const getVars = (params: Params<string>) => ({ id: params.id ?? "" });

export const loader = ({ context, params }: LoaderFunctionArgs) =>
  loaderQuery<boardQuery>(context, query, getVars(params));

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) =>
  clientLoaderQuery<boardQuery>(query, getVars(params));

export default function BoardPage() {
  const [{ viewer, board }] = useLoaderQuery<boardQuery>(query);

  return (
    <ViewerIdContext.Provider value={fromGlobalId(viewer.id)}>
      <div className="flex h-[100dvh] flex-col">
        <Header />
        <main
          className="flex min-h-0 min-w-[min(100dvw,1280px)] max-w-[100dvw]
            flex-1 flex-col self-center"
        >
          <div className="self-start px-2 pt-3 sm:px-4 sm:pt-5">
            <BoardTitle dataRef={board} />
          </div>
          <div
            className="flex min-h-0 flex-1 flex-col items-start overflow-x-auto
              p-2 sm:p-4 sm:pt-2"
          >
            <Board dataRef={board} />
          </div>
        </main>
      </div>
    </ViewerIdContext.Provider>
  );
}
