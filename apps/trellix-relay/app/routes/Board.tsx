import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { useRef } from "react";
import { graphql } from "react-relay";
import { useParams } from "react-router";
import { Suspense, metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Board } from "~/components/Board";
import { BoardTitle } from "~/components/BoardTitle";
import LoadingScreen from "~/components/LoadingScreen";
import useDragScroll from "~/hooks/useDragScroll";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { ViewerIdContext } from "~/lib/viewer-id-context";
import { BoardQuery } from "./__generated__/BoardQuery.graphql";
import { Route } from ".react-router/types/app/routes/+types/Board";

const query = graphql`
  query BoardQuery($id: ID!) {
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

export const meta = metaQuery<BoardQuery>(({ data }) => [
  { title: `${data.board.title} | Trellix Relay` },
]);

export const loader = ({ context, params }: Route.LoaderArgs) =>
  loaderQuery<BoardQuery>(context, query, params);

export const clientLoader = ({ params }: Route.ClientLoaderArgs) =>
  clientLoaderQuery<BoardQuery>(query, params);

export default function BoardPage() {
  const params = useParams();
  const [{ viewer, board }, refetch] = useLoaderQuery<BoardQuery>(query);

  useWindowVisible(() => refetch({ id: exists(params.id) }));

  const ref = useRef<HTMLDivElement>(null);
  const dragHandlers = useDragScroll(ref);

  const scrollToRight = () => {
    ref.current?.scrollTo({
      left: ref.current.scrollWidth,
      behavior: "instant",
    });
  };

  return (
    <ViewerIdContext value={fromGlobalId(viewer.id)}>
      <main
        className="flex h-[100dvh] flex-col items-center pt-[74px] sm:pt-[90px]"
      >
        <Suspense fallback={<LoadingScreen />}>
          <div
            className="flex min-w-[min(100dvw,1280px)] max-w-[100dvw] flex-1
              flex-col overflow-x-auto"
            ref={ref}
            {...dragHandlers}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
          >
            <div className="absolute self-start px-2 pt-3 sm:px-4 sm:pt-5">
              <BoardTitle dataRef={board} />
            </div>
            <div className="h-[54px] sm:h-[62px]" />
            <Board dataRef={board} scrollToRight={scrollToRight} />
          </div>
        </Suspense>
      </main>
    </ViewerIdContext>
  );
}
