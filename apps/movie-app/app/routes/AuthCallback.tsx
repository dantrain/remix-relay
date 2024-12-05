import { redirect } from "react-router";
import { getAuthenticator, getSessionStorage } from "~/lib/auth.server";
import { Route } from ".react-router/types/app/routes/+types/AuthCallback";

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await getAuthenticator(context).authenticate("github", request);
  const sessionStorage = getSessionStorage(context);

  if (user) {
    const session = await sessionStorage.getSession(
      request.headers.get("cookie"),
    );

    session.set("user", user);

    return redirect("/", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  }

  return redirect("/signin");
}
