import { FormEvent, useRef, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { BoardTitleFragment$key } from "./__generated__/BoardTitleFragment.graphql";
import { BoardTitleUpdateOneBoardMutation } from "./__generated__/BoardTitleUpdateOneBoardMutation.graphql";

const fragment = graphql`
  fragment BoardTitleFragment on Board {
    id
    title
  }
`;

const mutation = graphql`
  mutation BoardTitleUpdateOneBoardMutation($id: ID!, $title: String!) {
    updateOneBoard(id: $id, title: $title) {
      id
      title
    }
  }
`;

export function BoardTitle({ dataRef }: { dataRef: BoardTitleFragment$key }) {
  const { id, title } = useFragment(fragment, dataRef);
  const [isEditing, setIsEditing] = useState(false);
  const [commit] = useMutation<BoardTitleUpdateOneBoardMutation>(mutation);

  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const newTitle = (formData.get("title") as string).trim();

    if (newTitle && newTitle !== title) {
      commit({
        variables: { id, title: newTitle },
        optimisticResponse: { updateOneBoard: { id, title: newTitle } },
      });
    }

    setIsEditing(false);
  };

  return isEditing ? (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      onBlur={() => ref.current?.requestSubmit()}
    >
      <label className="sr-only" htmlFor="editBoardInput-title">
        Title
      </label>
      <input
        id="editBoardInput-title"
        name="title"
        className="block w-80 rounded-md border-transparent bg-slate-100 px-2
          py-1 text-2xl font-medium focus:border-slate-500 focus:bg-white
          focus:ring-0"
        placeholder="Enter a title"
        type="text"
        autoComplete="off"
        defaultValue={title}
        required
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  ) : (
    <Button
      className="border border-transparent px-2 py-1 text-left"
      variant="ghost"
      onPress={() => setIsEditing(true)}
    >
      <h1 className="line-clamp-1 text-2xl font-medium">{title}</h1>
    </Button>
  );
}
