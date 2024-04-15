import { Button, Spinner } from "@remix-relay/ui";
import { NavLink } from "@remix-run/react";
import { cx } from "class-variance-authority";
import { graphql, useFragment } from "react-relay";
import type { MovieLinkFragment$key } from "./__generated__/MovieLinkFragment.graphql";

const fragment = graphql`
  fragment MovieLinkFragment on Movie {
    slug
    title
    criticScore
    boxOffice
  }
`;

type MovieLinkProps = {
  dataRef: MovieLinkFragment$key;
};

export default function MovieLink({ dataRef }: MovieLinkProps) {
  const { slug, title, criticScore, boxOffice } = useFragment(
    fragment,
    dataRef,
  );

  return (
    <Button asChild>
      <NavLink
        className={cx(
          "group flex items-center gap-4 px-4 py-3",
          "[&.pending]:border-slate-600 [&.pending]:bg-slate-800",
          "[&.pending]:scale-[.99]",
        )}
        to={`/movie/${slug}`}
      >
        {({ isPending }) => (
          <>
            <div className="flex flex-grow items-center gap-4">
              <div className="text-2xl">{criticScore >= 60 ? "🍅" : "🤢"}</div>
              <div>
                <h3 className="text-md text-xl font-bold">{title}</h3>
                <dl className="flex gap-1 text-slate-400">
                  <div className="flex gap-1 after:content-['•']">
                    <dt className="sr-only">Critic Score</dt>
                    <dd>{criticScore}%</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Box Office (Gross USA)</dt>
                    <dd>{boxOffice}</dd>
                  </div>
                </dl>
              </div>
            </div>
            {isPending ? (
              <Spinner />
            ) : (
              <div className="hidden text-2xl group-hover:block">👉</div>
            )}
          </>
        )}
      </NavLink>
    </Button>
  );
}
