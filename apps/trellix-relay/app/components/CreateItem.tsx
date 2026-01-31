import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { createId } from "@paralleldrive/cuid2";
import { toGlobalId } from "graphql-relay";
import exists from "lib/exists";
import { getNextRank } from "lib/rank";
import { last, sortBy } from "lodash-es";
import { PlusIcon } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql, useMutation } from "react-relay";
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
      columnId
      ...ItemFragment
    }
  }
`;

type CreateItemProps = {
  columnId: string;
  connectionId: string;
  itemEdges: readonly { node: { rank: string } }[];
  scrollToBottom: () => void;
  isCreating: boolean;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
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
  const viewerId = exists(use(ViewerIdContext));
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const prevItemCountRef = useRef(itemEdges.length);

  // Clear input after new card appears (prevents placeholder flicker)
  useEffect(() => {
    if (itemEdges.length > prevItemCountRef.current) {
      // Double rAF ensures card has painted before clearing input
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setValue("");
          textAreaRef.current?.style.setProperty("height", "42px");
          scrollToBottom();
          textAreaRef.current?.focus();
        });
      });
    }
    prevItemCountRef.current = itemEdges.length;
  }, [itemEdges.length, scrollToBottom]);

  // Keep keyboard open on mobile by temporarily focusing a hidden input
  const keepMobileKeyboardOpen = () => {
    if (isDesktop) return;

    const tempInputEl = document.createElement("input");
    tempInputEl.style.position = "absolute";
    tempInputEl.style.top = "0";
    tempInputEl.style.left = "0";
    tempInputEl.style.height = "0";
    tempInputEl.style.opacity = "0";
    document.body.appendChild(tempInputEl);
    tempInputEl.focus();

    setTimeout(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.click();
      document.body.removeChild(tempInputEl);
    }, 100);
  };

  // @ts-expect-error awaiting usehooks-ts React 19 compatibility
  useOnClickOutside(formRef, () => setIsCreating(false), "mousedown");
  useOnClickOutside(
    // @ts-expect-error awaiting usehooks-ts React 19 compatibility
    formRef,
    () => setIsCreating(false),
    isDesktop ? "focusin" : "touchstart",
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const title = value.trim();

    if (title) {
      const id = `${viewerId}:${createId()}`;
      const rank = getNextRank(last(sortBy(itemEdges, "node.rank"))?.node);

      keepMobileKeyboardOpen();

      if (isDesktop) {
        requestIdleCallback(() => {
          scrollToBottom();
        });
      }

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
            columnId,
          },
        },
      });
    }
  };

  return isCreating ? (
    <form className="relative" ref={formRef} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="createItemInput-title">
        Text
      </label>
      <div
        className="mb-2 rounded-md border border-slate-200 bg-white shadow-sm"
      >
        <TextareaAutosize
          id="createItemInput-title"
          ref={textAreaRef}
          name="title"
          className="block w-full resize-none border-none bg-transparent py-2
            pr-10 pl-3 focus:ring-0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
          maxLength={100}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          required
        />
      </div>
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
