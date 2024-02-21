import { useLoaderQuery } from "@remix-relay/react";
import type { MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import MovieLink from "~/components/MovieLink";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    movies {
      id
      ...MovieLinkFragment
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Movie App" }];

export const loader = () => loaderQuery(query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function Index() {
  const [data] = useLoaderQuery<IndexQuery>(query);

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Top Box Office 🍿</h1>
      <ul className="grid gap-4">
        {data.movies.map((movie) => (
          <li key={movie.id}>
            <MovieLink dataRef={movie} />
          </li>
        ))}
      </ul>
    </main>
  );
}
