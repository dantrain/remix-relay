import { Button } from "@remix-relay/ui";
import { cx } from "class-variance-authority";
import { graphql, useFragment, useMutation } from "react-relay";
import type { LikeButtonFragment$key } from "./__generated__/LikeButtonFragment.graphql";
import type { LikeButtonMutation } from "./__generated__/LikeButtonMutation.graphql";

const fragment = graphql`
  fragment LikeButtonFragment on Movie {
    id
    liked
  }
`;

const mutation = graphql`
  mutation LikeButtonMutation($id: ID!, $liked: Boolean!) {
    setLikedMovie(id: $id, liked: $liked) {
      id
      liked
    }
  }
`;

type LikeButtonProps = {
  dataRef: LikeButtonFragment$key;
};

export default function LikeButton({ dataRef }: LikeButtonProps) {
  const { id, liked } = useFragment(fragment, dataRef);

  const [commit] = useMutation<LikeButtonMutation>(mutation);

  return (
    <Button
      className="flex gap-2"
      onClick={() =>
        commit({
          variables: { id, liked: !liked },
          optimisticResponse: { setLikedMovie: { id, liked: !liked } },
        })
      }
    >
      <span className={cx(!liked && "opacity-50")}>👍</span>
      <span className="w-[4ch] text-center">{liked ? "Liked" : "Like"}</span>
    </Button>
  );
}
