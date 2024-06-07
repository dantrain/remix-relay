import { graphql, useFragment } from "react-relay";
import { Button } from "@remix-relay/ui";
import { BoardListFragment$key } from "./__generated__/BoardListFragment.graphql";

const fragment = graphql`
  fragment BoardListFragment on User {
    boardConnection {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

type BoardListProps = {
  dataRef: BoardListFragment$key;
};

export default function BoardList({ dataRef }: BoardListProps) {
  const { boardConnection } = useFragment(fragment, dataRef);

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
      <li
        className="aspect-video content-center rounded-md border border-dashed
          border-slate-400 text-center"
      >
        <Button className="px-4 py-2" color="sky">
          Create new board
        </Button>
      </li>
      {boardConnection.edges.map(({ node }) => (
        <li
          key={node.id}
          className="aspect-video select-none rounded-sm bg-slate-100 p-3
            font-bold shadow-sm"
        >
          {node.name}
        </li>
      ))}
    </ul>
  );
}
