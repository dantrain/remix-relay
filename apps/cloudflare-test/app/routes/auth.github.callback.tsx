import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { authenticator } from "~/lib/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  return authenticator.authenticate("github", request, {
    context,
    successRedirect: "/",
    failureRedirect: "/signin",
  });
}
