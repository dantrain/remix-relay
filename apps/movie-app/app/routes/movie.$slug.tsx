import { Suspense, metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Spinner } from "@remix-relay/ui";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs, Params } from "@remix-run/react";
import { graphql } from "react-relay";
import BackLink from "~/components/BackLink";
import MovieDetail from "~/components/MovieDetail";
import MovieReviewsList from "~/components/MovieReviewsList";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import type { movieQuery } from "./__generated__/movieQuery.graphql";

const query = graphql`
  query movieQuery($slug: String!) {
    movie(slug: $slug) {
      title
      ...MovieDetailFragment
      ...MovieReviewsListFragment @defer
    }
  }
`;

export const meta = metaQuery<movieQuery>(({ data }) => [
  { title: `${data.movie.title} - Movie App` },
]);

const getVars = (params: Params<string>) => ({ slug: params.slug ?? "" });

export const loader = ({ params }: LoaderFunctionArgs) =>
  loaderQuery<movieQuery>(query, getVars(params));

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) =>
  clientLoaderQuery<movieQuery>(query, getVars(params));

export default function Movie() {
  const [data] = useLoaderQuery<movieQuery>(query);

  return (
    <>
      <nav className="mb-8">
        <BackLink />
      </nav>
      <main>
        <MovieDetail className="sm:mb-10" dataRef={data.movie} />
        <Suspense fallback={<Spinner className="h-28" />}>
          <MovieReviewsList dataRef={data.movie} />
        </Suspense>
      </main>
    </>
  );
}
