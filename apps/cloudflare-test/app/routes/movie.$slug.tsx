import { metaQuery, useLoaderQuery } from "@remix-relay/react";
import type { ClientLoaderFunctionArgs, Params } from "@remix-run/react";
import { graphql } from "react-relay";
import type { movieQuery } from "./__generated__/movieQuery.graphql";
import { loaderQuery } from "~/lib/loader-query.server";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import BackLink from "~/components/BackLink";
import MovieDetail from "~/components/MovieDetail";

const query = graphql`
  query movieQuery($slug: String!) {
    movie(slug: $slug) {
      title
      ...MovieDetailFragment
    }
  }
`;

export const meta = metaQuery<movieQuery>(({ data }) => [
  { title: `${data.movie.title} - Movie App` },
]);

const getVars = (params: Params<string>) => ({ slug: params.slug ?? "" });

export const loader = ({ context, params }: LoaderFunctionArgs) =>
  loaderQuery<movieQuery>(context, query, getVars(params));

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
      </main>
    </>
  );
}
