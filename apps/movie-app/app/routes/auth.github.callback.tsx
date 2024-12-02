import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { getAuthenticator, getSessionStorage } from "~/lib/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
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
