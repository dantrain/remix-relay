import { LoaderFunctionArgs } from "@remix-run/node";
import { Params, ClientLoaderFunctionArgs } from "@remix-run/react";
import { graphql } from "react-relay";
import { metaQuery, useLoaderQuery } from "@remix-relay/react";
import { Board } from "~/components/Board";
import Header from "~/components/Header";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { boardQuery } from "./__generated__/boardQuery.graphql";

const query = graphql`
  query boardQuery($id: ID!) {
    board(id: $id) {
      id
      name
    }
  }
`;

export const meta = metaQuery<boardQuery>(({ data }) => [
  { title: `${data.board.name} - Trellix Relay` },
]);

const getVars = (params: Params<string>) => ({ id: params.id ?? "" });

export const loader = ({ context, params }: LoaderFunctionArgs) =>
  loaderQuery<boardQuery>(context, query, getVars(params));

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) =>
  clientLoaderQuery<boardQuery>(query, getVars(params));

export default function BoardPage() {
  const [{ board }] = useLoaderQuery<boardQuery>(query);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1 overflow-x-auto p-4 sm:p-8">
        <h1 className="mx-2 mb-4 text-2xl font-medium">{board.name}</h1>
        <Board />
      </main>
    </div>
  );
}
