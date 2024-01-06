import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Spinner } from "@repo/ui";
import { graphql, useLazyLoadQuery } from "react-relay";
import MovieLink from "~/components/MovieLink";
import { Suspense } from "~/components/Suspense";
import { loaderQuery } from "~/lib/loaderQuery.server";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    movies {
      id
      ...MovieLinkFragment
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Movie App" }];

export const loader = async () => loaderQuery<IndexQuery>(indexQueryNode, {});

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Top Box Office 🍿</h1>
      <Suspense fallback={<Spinner className="h-28" />}>
        <MovieButtonList />
      </Suspense>
      <pre className="mt-8">{JSON.stringify(data, null, 4)}</pre>
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
