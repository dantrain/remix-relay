import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { graphql } from "react-relay";
import { useLoaderQuery } from "@remix-relay/react";
import BoardList from "~/components/BoardList";
import Header from "~/components/Header";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    viewer {
      ...BoardListFragment
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Trellix Relay" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery(context, query, {});

export const clientLoader = () => clientLoaderQuery(query, {});

export default function IndexPage() {
  const [data] = useLoaderQuery<IndexQuery>(query);

  return (
    <>
      <div className="fixed left-0 right-0 top-0">
        <Header />
      </div>
      <div className="flex-1 overflow-y-auto pt-[74px] sm:pt-[90px]">
        <main className="col-start-2 mx-auto max-w-7xl p-4 pt-5 sm:py-8">
          <h2 className="mb-4 text-lg font-bold uppercase text-slate-500">
            Your Boards
          </h2>

          <BoardList dataRef={data.viewer} />
        </main>
      </div>
    </>
  );
}
