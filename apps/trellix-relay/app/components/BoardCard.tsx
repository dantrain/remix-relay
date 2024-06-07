import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { BoardCardDeleteOneBoardMutation } from "./__generated__/BoardCardDeleteOneBoardMutation.graphql";
import { BoardCardFragment$key } from "./__generated__/BoardCardFragment.graphql";

const fragment = graphql`
  fragment BoardCardFragment on Board {
    id
    name
  }
`;

const deleteOneBoardMutation = graphql`
  mutation BoardCardDeleteOneBoardMutation($id: ID!, $connections: [ID!]!) {
    deleteOneBoard(id: $id) {
      id @deleteEdge(connections: $connections)
    }
  }
`;

type BoardCardProps = {
  dataRef: BoardCardFragment$key;
  connectionId: string;
};

export default function BoardCard({ dataRef, connectionId }: BoardCardProps) {
  const { id, name } = useFragment(fragment, dataRef);

  const [commit] = useMutation<BoardCardDeleteOneBoardMutation>(
    deleteOneBoardMutation,
  );

  const deleteBoard = () =>
    commit({
      variables: { id, connections: [connectionId] },
      optimisticResponse: { deleteOneBoard: { id } },
    });

  return (
    <div
      className="group flex aspect-video select-none items-start gap-3
        rounded-sm bg-slate-100 p-3 font-bold shadow-sm"
    >
      <div className="flex-1">{name}</div>
      <Button
        className="invisible pb-1.5 leading-none group-hover:visible"
        color="sky"
        onPress={deleteBoard}
      >
        <span className="sr-only">Delete</span>
        <span className="not-sr-only">&times;</span>
      </Button>
    </div>
  );
}
