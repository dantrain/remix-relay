import { Button, Spinner } from "@remix-relay/ui";
import { graphql, usePaginationFragment } from "react-relay";
import { MovieReview } from "./MovieReview";
import type { MovieReviewsListFragment$key } from "./__generated__/MovieReviewsListFragment.graphql";

const fragment = graphql`
  fragment MovieReviewsListFragment on Movie
  @refetchable(queryName: "MovieReviewsListPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String" }
  ) {
    reviews(first: $count, after: $cursor)
      @connection(key: "MovieReviewsListFragment_reviews") {
      edges {
        node {
          id
          ...MovieReviewFragment
        }
      }
    }
  }
`;

type MovieReviewsListProps = {
  dataRef: MovieReviewsListFragment$key;
};

export default function MovieReviewsList({ dataRef }: MovieReviewsListProps) {
  const {
    data: { reviews },
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment(fragment, dataRef);

  return (
    <>
      <ul className="mb-8">
        {reviews.edges.map(({ node }) => (
          <li key={node.id} className="mb-4">
            <MovieReview dataRef={node} />
          </li>
        ))}
      </ul>
      {isLoadingNext ? (
        <Spinner className="h-11" />
      ) : hasNext ? (
        <div className="flex justify-center">
          <Button className="px-3 py-2" onClick={() => loadNext(5)}>
            View more reviews
          </Button>
        </div>
      ) : null}
    </>
  );
}
