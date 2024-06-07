import { RefObject, createRef, useRef } from "react";
import { graphql, useFragment } from "react-relay";
import { Transition, TransitionGroup } from "react-transition-group";
import { cn } from "~/lib/cn";
import BoardCard from "./BoardCard";
import CreateBoard from "./CreateBoard";
import { BoardListFragment$key } from "./__generated__/BoardListFragment.graphql";

const fragment = graphql`
  fragment BoardListFragment on User {
    boardConnection {
      __id
      edges {
        node {
          id
          ...BoardCardFragment
        }
      }
    }
  }
`;

type BoardListProps = {
  dataRef: BoardListFragment$key;
};

export default function BoardList({ dataRef }: BoardListProps) {
  const {
    boardConnection: { edges, __id },
  } = useFragment(fragment, dataRef);

  const refs = useRef<Record<string, RefObject<HTMLLIElement>>>({});

  const getRef = (id: string) =>
    (refs.current[id] ??= createRef<HTMLLIElement>());

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
      <li
        className="aspect-video content-center rounded-md border border-dashed
          border-slate-400 text-center"
      >
        <CreateBoard connectionId={__id} />
      </li>
      <TransitionGroup component={null}>
        {edges.map(({ node }) => (
          <Transition
            key={node.id}
            nodeRef={getRef(node.id)}
            timeout={{ enter: 300, exit: 200 }}
          >
            {(state) => (
              <li
                className={cn(
                  state === "entering" &&
                    "animate-in fade-in zoom-in-90 duration-300",
                  state === "exiting" && "hidden",
                )}
                ref={getRef(node.id)}
              >
                <BoardCard dataRef={node} connectionId={__id} />
              </li>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    </ul>
  );
}
