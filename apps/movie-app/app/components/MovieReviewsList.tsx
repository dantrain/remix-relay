import { graphql, usePaginationFragment } from "react-relay";
import { Button, Spinner } from "@remix-relay/ui";
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
          <li className="mb-4" key={node.id}>
            <MovieReview dataRef={node} />
          </li>
        ))}
      </ul>
      {isLoadingNext ? (
        <div className="h-24 sm:h-11">
          <Spinner className="h-11" />
        </div>
      ) : hasNext ? (
        <div className="flex h-24 items-start justify-center sm:h-11">
          <Button className="px-3 py-2" onPress={() => loadNext(5)}>
            View more reviews
          </Button>
        </div>
      ) : null}
    </>
  );
}
