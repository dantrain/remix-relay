import { LoaderFunctionArgs } from "@remix-run/node";
import { Params, ClientLoaderFunctionArgs } from "@remix-run/react";
import { graphql } from "react-relay";
import { metaQuery, useLoaderQuery } from "@remix-relay/react";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { boardQuery } from "./__generated__/boardQuery.graphql";

const query = graphql`
  query boardQuery($id: ID!) {
    board(id: $id) {
      id
    }
  }
`;

export const meta = metaQuery<boardQuery>(({ data }) => [
  { title: `${data.board.id} - Trellix Relay` },
]);

const getVars = (params: Params<string>) => ({ id: params.id ?? "" });

export const loader = (args: LoaderFunctionArgs) =>
  loaderQuery<boardQuery>(args, query, getVars(args.params));

export const clientLoader = (args: ClientLoaderFunctionArgs) =>
  clientLoaderQuery<boardQuery>(query, getVars(args.params));

export default function Board() {
  const [data] = useLoaderQuery<boardQuery>(query);

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
