import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import { graphql, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { CreateBoardCreateOneBoardMutation } from "./__generated__/CreateBoardCreateOneBoardMutation.graphql";

const mutation = graphql`
  mutation CreateBoardCreateOneBoardMutation(
    $id: ID!
    $name: String!
    $connections: [ID!]!
  ) {
    createOneBoard(id: $id, name: $name)
      @appendNode(
        connections: $connections
        edgeTypeName: "BoardConnectionEdge"
      ) {
      id
      ...BoardCardFragment
    }
  }
`;

type CreateBoardProps = {
  connectionId: string;
};

export default function CreateBoard({ connectionId }: CreateBoardProps) {
  const [commit] = useMutation<CreateBoardCreateOneBoardMutation>(mutation);

  const createBoard = () => {
    const id = createId();

    commit({
      variables: {
        id,
        name: "foo",
        connections: [connectionId],
      },
      optimisticResponse: {
        createOneBoard: {
          id: toGlobalId("Board", id),
          name: "foo",
        },
      },
    });
  };

  return (
    <Button className="px-4 py-2" color="sky" onPress={createBoard}>
      Create new board
    </Button>
  );
}
