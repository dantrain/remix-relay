import { FormEvent, useRef, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { ColumnTitleFragment$key } from "./__generated__/ColumnTitleFragment.graphql";
import { ColumnTitleUpdateOneColumnMutation } from "./__generated__/ColumnTitleUpdateOneColumnMutation.graphql";

const fragment = graphql`
  fragment ColumnTitleFragment on Column {
    id
    title
  }
`;

const mutation = graphql`
  mutation ColumnTitleUpdateOneColumnMutation($id: ID!, $title: String!) {
    updateOneColumn(id: $id, title: $title) {
      id
      title
    }
  }
`;

type ColumnTitleProps = {
  dataRef: ColumnTitleFragment$key;
};

export function ColumnTitle({ dataRef }: ColumnTitleProps) {
  const { id, title } = useFragment(fragment, dataRef);
  const [isEditing, setIsEditing] = useState(false);
  const [commit] = useMutation<ColumnTitleUpdateOneColumnMutation>(mutation);

  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const newTitle = (formData.get("title") as string).trim();

    if (newTitle && newTitle !== title) {
      commit({
        variables: { id, title: newTitle },
        optimisticResponse: { updateOneColumn: { id, title: newTitle } },
      });
    }

    setIsEditing(false);
  };

  return isEditing ? (
    <form
      className="flex-1"
      ref={ref}
      onSubmit={handleSubmit}
      onBlur={() => ref.current?.requestSubmit()}
    >
      <label className="sr-only" htmlFor="editColumnInput-title">
        Title
      </label>
      <input
        id="editColumnInput-title"
        name="title"
        className="block w-full rounded-md border-none px-2 py-1 font-medium
          shadow-slate-500 focus:shadow-[inset_0_0_0_1px] focus:ring-0"
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
      className="min-w-6 px-2 py-1"
      variant="ghost"
      onPress={() => setIsEditing(true)}
    >
      <h2 className="line-clamp-1 text-left font-medium text-slate-800">
        {title}
      </h2>
    </Button>
  );
}
