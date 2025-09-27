import { cx } from "class-variance-authority";
import { fromGlobalId } from "lib/global-id";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFocusVisible } from "react-aria";
import { graphql, useFragment, useMutation } from "react-relay";
import { NavLink } from "react-router";
import { Button } from "@remix-relay/ui";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
} from "./ResponsiveDialog";
import { Spinner } from "./Spinner";
import { BoardCardDeleteOneBoardMutation } from "./__generated__/BoardCardDeleteOneBoardMutation.graphql";
import { BoardCardFragment$key } from "./__generated__/BoardCardFragment.graphql";

const fragment = graphql`
  fragment BoardCardFragment on Board {
    id
    title
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
  boardRef: BoardCardFragment$key;
  connectionId: string;
};

export default function BoardCard({ boardRef, connectionId }: BoardCardProps) {
  const { id, title } = useFragment(fragment, boardRef);
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
        className="aspect-3/1 flex select-none items-start gap-3 rounded-md
          bg-slate-100 p-3 font-bold shadow-sm ring-sky-500 ring-offset-2
          ring-offset-slate-200 focus:outline-none focus-visible:ring-2
          sm:aspect-video sm:group-hover:shadow-md [&.pending]:shadow-md"
        prefetch="render"
      >
        {({ isPending }) => (
          <>
            <div className="flex-1 text-lg sm:text-base">{title}</div>
            <div className="w-8" />
            {isPending ? (
              <div className="absolute inset-0 grid">
                <div
                  className="animate-pulse rounded-md bg-slate-400/50
                    [grid-area:1/1]"
                />
                <div
                  className="animate-fade flex items-center justify-center
                    [grid-area:1/1]"
                >
                  <Spinner />
                </div>
              </div>
            ) : null}
          </>
        )}
      </NavLink>
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trigger={
          <Button
            className={cx(
              `pointer-fine:p-1.5 pointer-fine:opacity-0
              pointer-fine:group-hover:opacity-100 absolute right-2 top-2 p-2
              leading-none`,
              isFocusVisible && "pointer-fine:focus:opacity-100",
            )}
            variant="ghost"
          >
            <Trash2Icon className="not-sr-only w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        }
        title={`Delete board “${title}”`}
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
