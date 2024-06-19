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
  useOnClickOutside(
    formRef,
    () => setIsCreating(false),
    isDesktop ? "focusin" : "touchstart",
  );

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

      let tempInputEl: HTMLInputElement | undefined;

      if (!isDesktop) {
        tempInputEl = document.createElement("input");
        tempInputEl.style.position = "absolute";
        tempInputEl.style.top = "0";
        tempInputEl.style.left = "0";
        tempInputEl.style.height = "0";
        tempInputEl.style.opacity = "0";
        document.body.appendChild(tempInputEl);
        tempInputEl.focus();
      }

      requestIdleCallback(() => {
        scrollToBottom();
      });

      setTimeout(
        () => {
          scrollToBottom();
          formRef.current?.reset();
          textAreaRef.current?.focus();

          if (tempInputEl) {
            textAreaRef.current?.click();
            document.body.removeChild(tempInputEl);
          }
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
          border-slate-200 bg-white pr-10 shadow-sm focus:border-slate-200
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
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        required
      />
      <div className="flex flex-row-reverse justify-start gap-2 sm:py-1">
        <Button
          className="px-4 py-2 sm:px-3 sm:py-1"
          variant="sky"
          type="submit"
          disableReactAria={!isDesktop}
        >
          Add card
        </Button>
        <Button
          className="px-4 py-2 sm:px-3 sm:py-1"
          variant="outline"
          onPress={() => setIsCreating(false)}
          disableReactAria={!isDesktop}
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
