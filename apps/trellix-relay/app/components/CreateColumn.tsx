import { createId } from "@paralleldrive/cuid2";
import { cx } from "class-variance-authority";
import { toGlobalId } from "graphql-relay";
import exists from "lib/exists";
import { getNextRank } from "lib/rank";
import { PlusIcon } from "lucide-react";
import { FormEvent, useContext, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { Button } from "@remix-relay/ui";
import { ViewerIdContext } from "~/lib/viewer-id-context";
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
        edgeTypeName: "BoardColumnConnectionEdge"
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
  scrollToRight: () => void;
};

export function CreateColumn({
  boardId,
  connectionId,
  lastColumn,
  scrollToRight,
}: CreateColumnProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isCreating, setIsCreating] = useState(!lastColumn && isDesktop);
  const [commit] = useMutation<CreateColumnCreateOneColumnMutation>(mutation);
  const viewerId = exists(useContext(ViewerIdContext));

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

      setTimeout(
        () => {
          scrollToRight();
          formRef.current?.reset();
          inputRef.current?.focus();

          if (tempInputEl) {
            inputRef.current?.click();
            document.body.removeChild(tempInputEl);
          }
        },
        isDesktop ? 0 : 100,
      );
    }
  };

  return isCreating ? (
    <form
      className="relative w-72 self-start rounded-md border border-[#d6dee8]
        bg-slate-100 sm:w-80"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="createColumnInput-title">
        Title
      </label>
      <input
        id="createColumnInput-title"
        ref={inputRef}
        name="title"
        className="block w-full rounded-md border-none bg-slate-100 font-medium
          focus:ring-0"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsCreating(false);
          }
        }}
        placeholder="Enter a title"
        type="text"
        autoComplete="off"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        required
      />
      <div className="flex flex-row-reverse justify-start gap-2 px-2 py-3">
        <Button
          className="px-4 py-2 sm:px-3 sm:py-1"
          variant="sky"
          type="submit"
        >
          Add column
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
    <div
      className={cx(
        "self-start",
        !lastColumn &&
          `flex h-24 w-72 items-center justify-center rounded-md border
            border-dashed border-slate-400 sm:w-80`,
      )}
    >
      <Button
        className={cx(
          "flex w-[max-content] items-center gap-1 px-4 py-2",
          !lastColumn && "m-2",
        )}
        variant={lastColumn ? "ghost" : "sky"}
        onPress={() => {
          setIsCreating(true);
          setTimeout(() => scrollToRight(), 0);
        }}
      >
        <PlusIcon className="not-sr-only w-4" />
        Add column
      </Button>
    </div>
  );
}
