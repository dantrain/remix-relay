import { NavLink } from "@remix-run/react";
import { cx } from "class-variance-authority";
import { fromGlobalId } from "lib/global-id";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFocusVisible } from "react-aria";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
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

  const { isFocusVisible } = useFocusVisible({ isTextInput: true });

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
      <NavLink
        to={`/board/${fromGlobalId(id)}`}
        className="ring-offset-3 flex aspect-video select-none items-start gap-3
          rounded-md bg-slate-100 p-3 font-bold shadow-sm ring-sky-500
          ring-offset-2 ring-offset-slate-200 focus:outline-none
          focus-visible:ring-2 group-hover:shadow-md [&.pending]:bg-[#e9eef4]"
        prefetch="viewport"
      >
        <div className="flex-1">{name}</div>
        <div className="h-full w-8" />
      </NavLink>
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trigger={
          <Button
            className={cx(
              `absolute right-2 top-2 p-1.5 leading-none sm:opacity-0
              sm:group-hover:opacity-100`,
              isFocusVisible && "sm:focus:opacity-100",
            )}
            variant="ghost"
          >
            <Trash2Icon className="not-sr-only w-6 sm:w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        }
        title={`Delete board “${name}”`}
        description="Are you sure?"
        content={
          <ResponsiveDialogFooter>
            <Button
              className="flex-1 px-3 py-2 sm:flex-none sm:py-1"
              variant="sky"
              onPress={deleteBoard}
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
    </div>
  );
}
