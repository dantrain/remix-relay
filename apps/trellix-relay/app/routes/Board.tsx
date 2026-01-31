import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { useRef } from "react";
import { graphql } from "react-relay";
import { useParams } from "react-router";
import { Deferred, metaQuery, useLoaderQuery } from "@remix-relay/react";
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
      <main className="flex h-dvh flex-col items-center pt-[74px] sm:pt-[90px]">
        <Deferred fallback={<LoadingScreen />}>
          <div
            className="flex max-w-dvw min-w-[min(100dvw,1280px)] flex-1 flex-col
              overflow-x-auto"
            ref={ref}
            {...dragHandlers}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
          >
            <div className="absolute self-start px-2 pt-3 sm:px-4 sm:pt-5">
              <BoardTitle boardRef={board} />
            </div>
            <div className="h-[54px] sm:h-[62px]" />
            <Board boardRef={board} scrollToRight={scrollToRight} />
          </div>
        </Deferred>
      </main>
    </ViewerIdContext>
  );
}
