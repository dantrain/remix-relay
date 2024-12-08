import { cx } from "class-variance-authority";
import { use } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { UserContext } from "~/root";
import { LikeButtonFragment$key } from "./__generated__/LikeButtonFragment.graphql";
import { LikeButtonMutation } from "./__generated__/LikeButtonMutation.graphql";

const fragment = graphql`
  fragment LikeButtonFragment on Movie {
    id
    likedByViewer
  }
`;

const mutation = graphql`
  mutation LikeButtonMutation($id: ID!, $liked: Boolean!) {
    setLikedMovie(id: $id, liked: $liked) {
      id
      likedByViewer
    }
  }
`;

type LikeButtonProps = {
  dataRef: LikeButtonFragment$key;
};

export default function LikeButton({ dataRef }: LikeButtonProps) {
  const user = use(UserContext);
  const { id, likedByViewer } = useFragment(fragment, dataRef);

  const [commit] = useMutation<LikeButtonMutation>(mutation);

  return user ? (
    <Button
      className="flex gap-2"
      onPress={() =>
        commit({
          variables: { id, liked: !likedByViewer },
          optimisticResponse: {
            setLikedMovie: { id, likedByViewer: !likedByViewer },
          },
        })
      }
    >
      <span className={cx(!likedByViewer && "opacity-50")}>👍</span>
      <span className="w-[4ch] text-center">
        {likedByViewer ? "Liked" : "Like"}
      </span>
    </Button>
  ) : null;
}
