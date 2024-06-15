import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import { FormEvent, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import {
  ResponsiveDialog,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from "./ResponsiveDialog";
import { CreateBoardCreateOneBoardMutation } from "./__generated__/CreateBoardCreateOneBoardMutation.graphql";

const mutation = graphql`
  mutation CreateBoardCreateOneBoardMutation(
    $id: ID!
    $name: String!
    $connections: [ID!]!
  ) {
    createOneBoard(id: $id, name: $name)
      @prependNode(
        connections: $connections
        edgeTypeName: "UserBoardConnectionEdge"
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commit] = useMutation<CreateBoardCreateOneBoardMutation>(mutation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = (formData.get("name") as string).trim();

    if (name) {
      const id = createId();

      commit({
        variables: {
          id,
          name,
          connections: [connectionId],
        },
        optimisticResponse: {
          createOneBoard: {
            id: toGlobalId("Board", id),
            name,
          },
        },
      });

      setDialogOpen(false);
    }
  };

  return (
    <ResponsiveDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Button className="px-4 py-2" variant="sky">
          Create new board
        </Button>
      }
      title="Create board"
      content={
        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="createBoardInput-name">
            Title
          </label>
          <input
            id="createBoardInput-name"
            name="name"
            className="mb-4 block w-full rounded-md border-transparent
              bg-slate-100 focus:border-slate-500 focus:bg-white focus:ring-0"
            placeholder="Enter a title"
            type="text"
            autoComplete="off"
            required
          />

          <ResponsiveDialogFooter>
            <Button
              className="flex-1 px-3 py-2 sm:flex-none sm:py-1"
              variant="sky"
              type="submit"
            >
              Create
            </Button>
            <ResponsiveDialogClose asChild>
              <Button className="px-3 py-2 sm:py-1" variant="outline">
                Cancel
              </Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        </form>
      }
    />
  );
}
