import { graphql, useFragment } from "react-relay";
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

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
      <li
        className="aspect-video content-center rounded-md border border-dashed
          border-slate-400 text-center"
      >
        <CreateBoard connectionId={__id} />
      </li>
      {edges.map(({ node }) => (
        <li key={node.id}>
          <BoardCard dataRef={node} connectionId={__id} />
        </li>
      ))}
    </ul>
  );
}
