import type { MetaFunction } from "@remix-run/node";
import { Button, Spinner } from "@repo/ui";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Suspense } from "~/components/Suspense";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    movies {
      id
      criticScore
      title
      boxOffice
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
      {data.movies.map(({ id, criticScore, title, boxOffice }) => (
        <li key={id}>
          <Button className="w-full px-4 py-3">
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
          </Button>
        </li>
      ))}
    </ul>
  );
}
