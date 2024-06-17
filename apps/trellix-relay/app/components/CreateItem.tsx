/* eslint-disable jsx-a11y/no-autofocus */
import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import exists from "lib/exists";
import { getNextRank } from "lib/rank";
import { last, sortBy } from "lodash-es";
import { PlusIcon } from "lucide-react";
import { FormEvent, useContext, useRef } from "react";
import { graphql, useMutation } from "react-relay";
import TextareaAutosize from "react-textarea-autosize";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { Button } from "@remix-relay/ui";
import { ViewerIdContext } from "~/lib/viewer-id-context";
import { CreateItemCreateOneItemMutation } from "./__generated__/CreateItemCreateOneItemMutation.graphql";

const mutation = graphql`
  mutation CreateItemCreateOneItemMutation(
    $id: ID!
    $columnId: ID!
    $title: String!
    $rank: String!
    $connections: [ID!]!
  ) {
    createOneItem(id: $id, columnId: $columnId, title: $title, rank: $rank)
      @appendNode(
        connections: $connections
        edgeTypeName: "ColumnItemConnectionEdge"
      ) {
      id
      rank
      title
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
  const viewerId = exists(useContext(ViewerIdContext));
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useOnClickOutside(formRef, () => setIsCreating(false), "mousedown");
  useOnClickOutside(formRef, () => setIsCreating(false), "focusin");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const title = (formData.get("title") as string).trim();

    if (title) {
      const id = `${viewerId}:${createId()}`;
      const rank = getNextRank(last(sortBy(itemEdges, "node.rank"))?.node);

      commit({
        variables: {
          id,
          title,
          columnId,
          rank,
          connections: [connectionId],
        },
        optimisticResponse: {
          createOneItem: {
            id: toGlobalId("Item", id),
            title,
            rank,
          },
        },
      });

      setTimeout(
        () => {
          scrollToBottom();
          formRef.current?.reset();
          textAreaRef.current?.focus();
        },
        isDesktop ? 0 : 100,
      );
    }
  };

  return isCreating ? (
    <form className="relative" ref={formRef} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="createItemInput-title">
        Text
      </label>
      <TextareaAutosize
        id="createItemInput-title"
        ref={textAreaRef}
        name="title"
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
      <div className="flex flex-row-reverse justify-start gap-2 sm:py-1">
        <Button
          className="px-4 py-2 sm:px-3 sm:py-1"
          variant="sky"
          type="submit"
        >
          Add card
        </Button>
        <Button
          className="px-4 py-2 sm:px-3 sm:py-1"
          variant="outline"
          onPress={() => setIsCreating(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  ) : (
    <Button
      className="flex w-full items-center gap-1 py-2 text-left"
      variant="ghost"
      onPress={() => {
        setIsCreating(true);
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }}
    >
      <PlusIcon className="not-sr-only w-4" />
      Add card
    </Button>
  );
}
