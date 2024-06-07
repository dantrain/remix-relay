import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import {
  ResponsiveDialog,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from "./ResponsiveDialog";
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
  const [open, setOpen] = useState(false);

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
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button
            className="pb-1.5 leading-none group-hover:visible sm:invisible"
            color="sky"
          >
            <span className="sr-only">Delete</span>
            <span className="not-sr-only">&times;</span>
          </Button>
        }
        title={`Delete board “${name}”`}
        description="Are you sure?"
        content={
          <ResponsiveDialogFooter>
            <Button
              className="flex-1 sm:flex-none"
              color="sky"
              onPress={deleteBoard}
            >
              Delete
            </Button>
            <ResponsiveDialogClose asChild>
              <Button color="sky">Cancel</Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        }
      />
    </div>
  );
}
