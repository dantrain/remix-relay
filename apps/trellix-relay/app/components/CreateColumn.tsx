/* eslint-disable jsx-a11y/no-autofocus */
import { createId } from "@paralleldrive/cuid2";
import { cx } from "class-variance-authority";
import { toGlobalId } from "graphql-relay";
import { getNextRank } from "lib/rank";
import { FormEvent, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useOnClickOutside } from "usehooks-ts";
import { Button } from "@remix-relay/ui";
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
};

export function CreateColumn({
  boardId,
  connectionId,
  lastColumn,
}: CreateColumnProps) {
  const [isCreating, setIsCreating] = useState(!lastColumn);
  const [commit] = useMutation<CreateColumnCreateOneColumnMutation>(mutation);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(formRef, () => setIsCreating(false), "mousedown");
  useOnClickOutside(formRef, () => setIsCreating(false), "focusin");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const title = (formData.get("title") as string).trim();

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

      requestIdleCallback(() => {
        formRef.current?.reset();
        inputRef.current?.focus();
      });
    }
  };

  return isCreating ? (
    <form
      className="w-80 self-start rounded-md border border-[#d6dee8] bg-slate-100"
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
        autoFocus
        required
      />
      <div className="flex flex-row-reverse justify-start gap-2 px-2 py-3">
        <Button className="px-3 py-2 sm:py-1" variant="sky" type="submit">
          Add column
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
      className={cx(
        "w-[max-content] self-start px-4 py-2",
        !lastColumn && "m-2",
      )}
      variant={lastColumn ? "ghost" : "sky"}
      onPress={() => setIsCreating(true)}
    >
      + Add column
    </Button>
  );
}
