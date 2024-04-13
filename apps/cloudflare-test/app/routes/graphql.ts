import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createYoga } from "graphql-yoga";
import { schema } from "~/graphql/graphql-schema";

const yoga = createYoga({ schema });

export async function loader({ request }: LoaderFunctionArgs) {
  return yoga.handleRequest(request, {});
}

export async function action({ request }: ActionFunctionArgs) {
  return yoga.handleRequest(request, {});
}
