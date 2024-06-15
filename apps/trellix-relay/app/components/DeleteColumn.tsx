import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { DeleteIcon } from "./Icons";
import {
  ResponsiveDialog,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from "./ResponsiveDialog";
import { DeleteColumnDeleteOneColumnMutation } from "./__generated__/DeleteColumnDeleteOneColumnMutation.graphql";

const deleteOneColumnMutation = graphql`
  mutation DeleteColumnDeleteOneColumnMutation($id: ID!, $connections: [ID!]!) {
    deleteOneColumn(id: $id) {
      id @deleteEdge(connections: $connections)
    }
  }
`;

type DeleteColumnProps = {
  id: string;
  connectionId: string;
  title: string;
};

export function DeleteColumn({ id, connectionId, title }: DeleteColumnProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [commit] = useMutation<DeleteColumnDeleteOneColumnMutation>(
    deleteOneColumnMutation,
  );

  const deleteColumn = () => {
    commit({
      variables: { id, connections: [connectionId] },
      optimisticResponse: { deleteOneColumn: { id } },
    });

    setDialogOpen(false);
  };

  return (
    <ResponsiveDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Button className="relative p-2 sm:p-1" variant="ghost">
          <DeleteIcon className="not-sr-only w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      }
      title={`Delete column “${title}”`}
      description="All the items in the column will be deleted."
      content={
        <ResponsiveDialogFooter>
          <Button
            className="flex-1 px-3 py-2 sm:flex-none sm:py-1"
            variant="sky"
            onPress={deleteColumn}
          >
            Delete
          </Button>
          <ResponsiveDialogClose asChild>
            <Button className="px-3 py-2 sm:py-1" variant="outline">
              Cancel
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      }
    />
  );
}
