import { Link } from "@remix-run/react";
import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { fromGlobalId } from "server/lib/global-id";
import { Button } from "@remix-relay/ui";
import { DeleteIcon } from "./Icons";
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const [commit] = useMutation<BoardCardDeleteOneBoardMutation>(
    deleteOneBoardMutation,
  );

  const deleteBoard = () => {
    commit({
      variables: { id, connections: [connectionId] },
      optimisticResponse: { deleteOneBoard: { id } },
    });

    setDialogOpen(false);
  };

  return (
    <div className="group relative">
      <Link
        to={`/board/${fromGlobalId(id)}`}
        className="flex aspect-video select-none items-start gap-3 rounded-sm
          bg-slate-100 p-3 font-bold shadow-sm group-hover:shadow-md"
      >
        <div className="flex-1">{name}</div>
        <div className="h-full w-8" />
      </Link>
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trigger={
          <Button
            className="absolute right-3 top-3 py-1.5 leading-none sm:opacity-0
              sm:transition-opacity sm:group-hover:opacity-100"
            color="sky"
          >
            <DeleteIcon className="not-sr-only w-6 sm:w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        }
        title={`Delete board “${name}”`}
        description="Are you sure?"
        content={
          <ResponsiveDialogFooter>
            <Button
              className="flex-1 px-3 py-2 sm:flex-none sm:py-1"
              color="sky"
              onPress={deleteBoard}
            >
              Delete
            </Button>
            <ResponsiveDialogClose asChild>
              <Button className="px-3 py-2 sm:py-1" color="sky">
                Cancel
              </Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        }
      />
    </div>
  );
}
