import { graphql } from "react-relay";
import { Deferred, metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Spinner } from "@remix-relay/ui";
import BackLink from "~/components/BackLink";
import MovieDetail from "~/components/MovieDetail";
import MovieReviewsList from "~/components/MovieReviewsList";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import type { MovieQuery } from "./__generated__/MovieQuery.graphql";
import { Route } from ".react-router/types/app/routes/+types/Movie";

const query = graphql`
  query MovieQuery($slug: String!) {
    movie(slug: $slug) {
      title
      ...MovieDetailFragment
      ...MovieReviewsListFragment @defer
    }
  }
`;

export const meta = metaQuery<MovieQuery>(({ data }) => [
  { title: `${data.movie.title} - Movie App` },
]);

export const loader = (args: Route.LoaderArgs) =>
  loaderQuery<MovieQuery>(args, query, args.params);

export const clientLoader = (args: Route.ClientLoaderArgs) =>
  clientLoaderQuery<MovieQuery>(query, args.params);

export default function Movie() {
  const [data] = useLoaderQuery<MovieQuery>(query);

  return (
    <>
      <nav className="mb-8">
        <BackLink />
      </nav>
      <main>
        <MovieDetail className="sm:mb-10" movieRef={data.movie} />
        <Deferred fallback={<Spinner className="h-28" />}>
          <MovieReviewsList movieRef={data.movie} />
        </Deferred>
      </main>
    </>
  );
}
