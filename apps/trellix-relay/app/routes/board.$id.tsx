import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Params, useParams } from "@remix-run/react";
import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { MouseEvent, useRef } from "react";
import { graphql } from "react-relay";
import { Suspense, metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Board } from "~/components/Board";
import { BoardTitle } from "~/components/BoardTitle";
import Header from "~/components/Header";
import LoadingScreen from "~/components/LoadingScreen";
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

  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 1 && e.button !== 2) return; // Only allow right or middle mouse button
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
    ref.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current?.offsetLeft ?? 0);
    ref.current.scrollLeft = (scrollLeft.current ?? 0) - (x - startX.current);
  };

  const handleMouseUp = () => {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "";
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "";
  };

  const scrollToRight = () => {
    ref.current?.scrollTo({
      left: ref.current.scrollWidth,
      behavior: "instant",
    });
  };

  return (
    <ViewerIdContext.Provider value={fromGlobalId(viewer.id)}>
      <div className="fixed left-0 right-0 top-0 z-30">
        <Header />
      </div>
      <main
        className="flex h-[100dvh] flex-col items-center pt-[74px] sm:pt-[90px]"
      >
        <Suspense fallback={<LoadingScreen />}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="flex min-w-[min(100dvw,1280px)] max-w-[100dvw] flex-1
              flex-col overflow-x-auto"
            ref={ref}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
          >
            <div className="fixed self-start px-2 pt-3 sm:px-4 sm:pt-5">
              <BoardTitle dataRef={board} />
            </div>
            <div className="h-[54px] sm:h-[62px]" />
            <Board dataRef={board} scrollToRight={scrollToRight} />
          </div>
        </Suspense>
      </main>
    </ViewerIdContext.Provider>
  );
}
