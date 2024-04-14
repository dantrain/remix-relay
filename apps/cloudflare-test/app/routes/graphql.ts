/* eslint-disable react-hooks/rules-of-hooks */
import { useDeferStream } from "@graphql-yoga/plugin-defer-stream";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createYoga } from "graphql-yoga";
import { schema } from "~/schema/graphql-schema";

const yoga = createYoga({ schema, plugins: [useDeferStream()] });

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Env;
  return yoga.handleRequest(request, env);
}
