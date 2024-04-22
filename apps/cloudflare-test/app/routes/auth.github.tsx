import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { authenticator } from "~/lib/auth.server";

export async function action({ request, context }: ActionFunctionArgs) {
  return authenticator.authenticate("github", request, { context });
}
