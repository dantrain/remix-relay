import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/lib/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  return getAuthenticator(context).authenticate("github", request, {
    context,
    successRedirect: "/",
    failureRedirect: "/signin",
  });
}
