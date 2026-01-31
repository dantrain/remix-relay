import { graphql, useFragment } from "react-relay";
import type { MovieReviewFragment$key } from "./__generated__/MovieReviewFragment.graphql";

const fragment = graphql`
  fragment MovieReviewFragment on Review {
    quote
    fresh
    criticName
    criticSource
  }
`;

type MovieReviewProps = {
  reviewRef: MovieReviewFragment$key;
};

export function MovieReview({ reviewRef }: MovieReviewProps) {
  const { fresh, quote, criticName, criticSource } = useFragment(
    fragment,
    reviewRef,
  );

  return (
    <div
      className="flex break-inside-avoid-column gap-4 rounded-md bg-slate-900
        px-5 py-4"
    >
      <div className="text-2xl">{fresh ? "🍅" : "🤢"}</div>
      <blockquote className="break-words">
        <p className="mb-2">{quote}</p>
        <cite className="text-slate-400 not-italic">
          {criticName}, {criticSource}
        </cite>
      </blockquote>
    </div>
  );
}
