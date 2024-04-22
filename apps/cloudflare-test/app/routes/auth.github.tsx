import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/lib/auth.server";

export async function action({ request, context }: ActionFunctionArgs) {
  return getAuthenticator(context).authenticate("github", request, { context });
}
