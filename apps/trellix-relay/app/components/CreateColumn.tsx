import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import { getNextRank } from "lib/rank";
import { FormEvent, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
} from "./ResponsiveDialog";
import { CreateColumnCreateOneColumnMutation } from "./__generated__/CreateColumnCreateOneColumnMutation.graphql";

const mutation = graphql`
  mutation CreateColumnCreateOneColumnMutation(
    $id: ID!
    $title: String!
    $rank: String!
    $boardId: ID!
    $connections: [ID!]!
  ) {
    createOneColumn(id: $id, title: $title, rank: $rank, boardId: $boardId)
      @appendNode(
        connections: $connections
        edgeTypeName: "ColumnConnectionEdge"
      ) {
      id
      title
      rank
      itemConnection {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

type CreateColumnProps = {
  boardId: string;
  connectionId: string;
  lastColumn?: { rank: string };
};

export function CreateColumn({
  boardId,
  connectionId,
  lastColumn,
}: CreateColumnProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commit] = useMutation<CreateColumnCreateOneColumnMutation>(mutation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;

    if (title) {
      const id = createId();
      const rank = getNextRank(lastColumn);

      commit({
        variables: {
          id,
          title,
          boardId,
          rank,
          connections: [connectionId],
        },
        optimisticResponse: {
          createOneColumn: {
            id: toGlobalId("Column", id),
            title,
            rank,
            itemConnection: {
              edges: [],
            },
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
        <Button className="px-4 py-2" color="sky">
          + Add column
        </Button>
      }
      title="Add column"
      content={
        <form onSubmit={handleSubmit}>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="createColumnInput-title"
          >
            Title
          </label>
          <input
            id="createColumnInput-title"
            name="title"
            className="mb-6 block w-full rounded-md border-transparent
              bg-slate-100 focus:border-slate-500 focus:bg-white focus:ring-0"
            type="text"
            autoComplete="off"
            required
          />

          <ResponsiveDialogFooter>
            <Button
              className="flex-1 px-3 py-2 sm:flex-none sm:py-1"
              color="sky"
              type="submit"
            >
              Add
            </Button>
            <ResponsiveDialogClose asChild>
              <Button className="px-3 py-2 sm:py-1" color="sky">
                Cancel
              </Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        </form>
      }
    />
  );
}
