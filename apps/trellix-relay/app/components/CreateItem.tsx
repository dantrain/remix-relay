import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import { getNextRank } from "lib/rank";
import { last, sortBy } from "lodash-es";
import { FormEvent, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
} from "./ResponsiveDialog";
import { CreateItemCreateOneItemMutation } from "./__generated__/CreateItemCreateOneItemMutation.graphql";

const mutation = graphql`
  mutation CreateItemCreateOneItemMutation(
    $id: ID!
    $columnId: ID!
    $text: String!
    $rank: String!
    $connections: [ID!]!
  ) {
    createOneItem(id: $id, columnId: $columnId, text: $text, rank: $rank)
      @appendNode(
        connections: $connections
        edgeTypeName: "ColumnItemConnectionEdge"
      ) {
      id
      rank
      text
    }
  }
`;

type CreateItemProps = {
  columnId: string;
  connectionId: string;
  itemEdges: readonly { node: { rank: string } }[];
  scrollToBottom: () => void;
};

export function CreateItem({
  columnId,
  connectionId,
  itemEdges,
  scrollToBottom,
}: CreateItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commit] = useMutation<CreateItemCreateOneItemMutation>(mutation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const text = (formData.get("text") as string).trim();

    if (text) {
      const id = createId();
      const rank = getNextRank(last(sortBy(itemEdges, "node.rank"))?.node);

      commit({
        variables: {
          id,
          text,
          columnId,
          rank,
          connections: [connectionId],
        },
        optimisticResponse: {
          createOneItem: {
            id: toGlobalId("Item", id),
            text,
            rank,
          },
        },
        onCompleted: scrollToBottom,
      });

      setDialogOpen(false);
    }
  };

  return (
    <ResponsiveDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Button className="w-full py-2 text-left" variant="ghost">
          + Add card
        </Button>
      }
      title="Add card"
      content={
        <form className="relative" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="createItemInput-text">
            Text
          </label>
          <input
            id="createItemInput-text"
            name="text"
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
              Add
            </Button>
            <ResponsiveDialogClose asChild>
              <Button className="px-3 py-2 sm:py-1" variant="sky">
                Cancel
              </Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        </form>
      }
    />
  );
}
