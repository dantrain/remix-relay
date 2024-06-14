/* eslint-disable jsx-a11y/no-autofocus */
import { FormEvent, useRef, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { BoardTitleFragment$key } from "./__generated__/BoardTitleFragment.graphql";
import { BoardTitleUpdateOneBoardMutation } from "./__generated__/BoardTitleUpdateOneBoardMutation.graphql";

const fragment = graphql`
  fragment BoardTitleFragment on Board {
    id
    name
  }
`;

const mutation = graphql`
  mutation BoardTitleUpdateOneBoardMutation($id: ID!, $name: String!) {
    updateOneBoard(id: $id, name: $name) {
      id
      name
    }
  }
`;

export function BoardTitle({ dataRef }: { dataRef: BoardTitleFragment$key }) {
  const { id, name } = useFragment(fragment, dataRef);
  const [isEditing, setIsEditing] = useState(false);
  const [commit] = useMutation<BoardTitleUpdateOneBoardMutation>(mutation);

  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const newName = (formData.get("name") as string).trim();

    if (newName && newName !== name) {
      commit({
        variables: { id, name: newName },
        optimisticResponse: { updateOneBoard: { id, name: newName } },
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
      <label className="sr-only" htmlFor="editBoardInput-name">
        Title
      </label>
      <input
        id="editBoardInput-name"
        name="name"
        className="block w-80 rounded-md border-transparent bg-slate-100 px-2
          py-1 text-2xl font-medium focus:border-slate-500 focus:bg-white
          focus:ring-0"
        placeholder="Enter a title"
        type="text"
        autoComplete="off"
        defaultValue={name}
        required
        autoFocus
      />
    </form>
  ) : (
    <Button
      className="border border-transparent px-2 py-1"
      variant="ghost"
      onPress={() => setIsEditing(true)}
    >
      <h1 className="inline text-2xl font-medium">{name}</h1>
    </Button>
  );
}
