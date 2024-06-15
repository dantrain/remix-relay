/* eslint-disable jsx-a11y/no-autofocus */
import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import { getNextRank } from "lib/rank";
import { last, sortBy } from "lodash-es";
import { FormEvent, useRef } from "react";
import { graphql, useMutation } from "react-relay";
import { useOnClickOutside } from "usehooks-ts";
import { Button } from "@remix-relay/ui";
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
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CreateItem({
  columnId,
  connectionId,
  itemEdges,
  scrollToBottom,
  isCreating,
  setIsCreating,
}: CreateItemProps) {
  const [commit] = useMutation<CreateItemCreateOneItemMutation>(mutation);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(formRef, () => setIsCreating(false), "mousedown");
  useOnClickOutside(formRef, () => setIsCreating(false), "focusout");

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
        onCompleted: () => {
          scrollToBottom();
          formRef.current?.reset();
          inputRef.current?.focus();
        },
      });
    }
  };

  return isCreating ? (
    <form className="relative" ref={formRef} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="createItemInput-text">
        Text
      </label>
      <input
        id="createItemInput-text"
        ref={inputRef}
        name="text"
        className="mb-2 block w-full rounded-md border border-slate-200 bg-white
          shadow-sm focus:border-slate-200 focus:ring-0"
        placeholder="Enter a title"
        type="text"
        autoComplete="off"
        autoFocus
        required
      />
      <div className="flex flex-row-reverse justify-start gap-2">
        <Button
          className="flex-1 px-3 py-2 sm:flex-none sm:py-1"
          variant="sky"
          type="submit"
        >
          Add
        </Button>
        <Button
          className="px-3 py-2 sm:py-1"
          variant="sky"
          onPress={() => setIsCreating(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  ) : (
    <Button
      className="w-full py-2 text-left"
      variant="ghost"
      onPress={() => setIsCreating(true)}
    >
      + Add card
    </Button>
  );
}
