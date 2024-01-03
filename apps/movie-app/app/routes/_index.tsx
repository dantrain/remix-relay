import type { MetaFunction } from "@remix-run/node";
import { Spinner } from "@repo/ui";
import { graphql, useLazyLoadQuery } from "react-relay";
import MovieLink from "~/components/MovieLink";
import { Suspense } from "~/components/Suspense";
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

export default function Index() {
  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Top Box Office 🍿</h1>
      <Suspense fallback={<Spinner className="h-28" />}>
        <MovieButtonList />
      </Suspense>
    </main>
  );
}

function MovieButtonList() {
  const data = useLazyLoadQuery<IndexQuery>(query, {});

  return (
    <ul className="grid gap-4">
      {data.movies.map((movie) => (
        <li key={movie.id}>
          <MovieLink dataRef={movie} />
        </li>
      ))}
    </ul>
  );
}
