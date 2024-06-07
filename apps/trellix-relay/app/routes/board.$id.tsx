import { LoaderFunctionArgs } from "@remix-run/node";
import { Params, ClientLoaderFunctionArgs } from "@remix-run/react";
import { graphql } from "react-relay";
import { metaQuery, useLoaderQuery } from "@remix-relay/react";
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

export default function Board() {
  const [
    {
      board: { name },
    },
  ] = useLoaderQuery<boardQuery>(query);

  return (
    <>
      <Header />
      <main className="p-4 sm:p-8">
        <h1 className="text-2xl font-medium">{name}</h1>
      </main>
    </>
  );
}
