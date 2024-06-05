import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { graphql } from "react-relay";
import { useLoaderQuery } from "@remix-relay/react";
import { Button } from "@remix-relay/ui";
import { SignOutIcon } from "~/components/Icons";
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
    <>
      <header
        className="flex items-center justify-between bg-slate-900 p-6 text-white
          sm:px-8"
      >
        <Link to="/">
          <h1 className="mb-0.5 text-2xl font-black leading-none">Trellix</h1>
          <p className="leading-none text-slate-500">a remix-relay demo</p>
        </Link>
        <Button asChild className="px-3">
          <a className="flex items-center gap-2" href="/auth/signout">
            <SignOutIcon />
            Sign out
          </a>
        </Button>
      </header>
      <main className="p-4 sm:p-8">
        <pre
          className="overflow-x-auto rounded-md bg-white p-3 text-sm
            text-slate-800 shadow-sm"
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </main>
    </>
  );
}
