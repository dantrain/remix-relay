import { useLoaderQuery } from "@remix-relay/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { graphql } from "react-relay";
import MovieLink from "~/components/MovieLink";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";
import { clientLoaderQuery } from "~/lib/client-loader-query";

const query = graphql`
  query IndexQuery {
    movies {
      edges {
        node {
          id
          ...MovieLinkFragment
        }
      }
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Movie App" }];

export const loader = async ({ context }: LoaderFunctionArgs) =>
  loaderQuery(context, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function Index() {
  const [data] = useLoaderQuery<IndexQuery>(query);

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Top Box Office 🍿</h1>
      <ul className="grid gap-4">
        {data.movies.edges.map(({ node }) => (
          <li key={node.id}>
            <MovieLink dataRef={node} />
          </li>
        ))}
      </ul>
    </main>
  );
}
