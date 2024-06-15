/* eslint-disable jsx-a11y/no-autofocus */
import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import { getNextRank } from "lib/rank";
import { last, sortBy } from "lodash-es";
import { FormEvent, useRef } from "react";
import { graphql, useMutation } from "react-relay";
import TextareaAutosize from "react-textarea-autosize";
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useOnClickOutside(formRef, () => setIsCreating(false), "mousedown");
  useOnClickOutside(formRef, () => setIsCreating(false), "focusin");

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
      });

      requestIdleCallback(() => {
        scrollToBottom();
        formRef.current?.reset();
        textAreaRef.current?.focus();
      });
    }
  };

  return isCreating ? (
    <form className="relative" ref={formRef} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="createItemInput-text">
        Text
      </label>
      <TextareaAutosize
        id="createItemInput-text"
        ref={textAreaRef}
        name="text"
        className="mb-2 block w-full resize-none rounded-md border
          border-slate-200 bg-white pr-8 shadow-sm focus:border-slate-200
          focus:ring-0"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            formRef.current?.requestSubmit();
          }
          if (event.key === "Escape") {
            setIsCreating(false);
          }
        }}
        placeholder="Enter a title"
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
          Add card
        </Button>
        <Button
          className="px-3 py-2 sm:py-1"
          variant="outline"
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
