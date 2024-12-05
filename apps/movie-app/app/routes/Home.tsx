import { graphql } from "react-relay";
import type { MetaFunction } from "react-router";
import { useLoaderQuery } from "@remix-relay/react";
import MovieLink from "~/components/MovieLink";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { HomeQuery } from "./__generated__/HomeQuery.graphql";
import { Route } from ".react-router/types/app/routes/+types/Home";

const query = graphql`
  query HomeQuery {
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

export const loader = async (args: Route.LoaderArgs) =>
  loaderQuery(args, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function Index() {
  const [data] = useLoaderQuery<HomeQuery>(query);

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
