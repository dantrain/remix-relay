import { getAuthenticator } from "~/lib/auth.server";
import { Route } from ".react-router/types/app/routes/+types/Auth";

export async function action({ request, context }: Route.ActionArgs) {
  return getAuthenticator(context).authenticate("github", request);
}
