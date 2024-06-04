import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import { useLoaderQuery } from "@remix-relay/react";
import { Button } from "@remix-relay/ui";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    viewer {
      id
      boardConnection {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Trellix Relay" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery(context, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function Index() {
  const [data] = useLoaderQuery<IndexQuery>(query);

  return (
    <main>
      <div className="mb-8 mt-2 flex items-start justify-between">
        <h1 className="text-2xl font-bold">Trellix Relay</h1>
        <Button asChild className="px-3">
          <a className="flex items-center gap-2" href="/auth/signout">
            Sign out
          </a>
        </Button>
      </div>
      <pre className="rounded-md bg-slate-900 p-4 text-sm text-slate-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
