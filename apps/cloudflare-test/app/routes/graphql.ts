import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { yoga } from "~/lib/yoga";

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Env;
  return yoga.handleRequest(request, env);
}
