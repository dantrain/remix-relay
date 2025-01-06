import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import {
  Form,
  Link,
  Links,
  LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import { RemixRelayProvider } from "@remix-relay/react";
import { Button, Spinner } from "@remix-relay/ui";
import { authenticate, getSessionStorage } from "./lib/auth.server";
import { getCurrentEnvironment } from "./lib/relay-environment";
import styles from "./tailwind.css?url";
import { Route } from ".react-router/types/app/+types/root";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request, context }: Route.LoaderArgs) {
  return authenticate(request, context);
}

export const useUser = () => useRouteLoaderData<typeof loader>("root");

export async function action({ request, context }: Route.ActionArgs) {
  const sessionStorage = getSessionStorage(context);

  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );

  return redirect("/signin", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-950 text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData: user }: Route.ComponentProps) {
  const location = useLocation();

  return (
    <RemixRelayProvider>
      <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
        <div className="relative mx-auto max-w-3xl p-4 pb-8 sm:p-8">
          <div className="absolute right-4 sm:right-8">
            {user ? (
              <Form method="post">
                <Button className="text-2xl" type="submit">
                  🔓
                </Button>
              </Form>
            ) : location.pathname !== "/signin" ? (
              <Button className="text-2xl" asChild>
                <Link to="/signin">🔐</Link>
              </Button>
            ) : null}
          </div>
          <Suspense fallback={<Spinner className="h-36" />}>
            <Outlet />
          </Suspense>
        </div>
      </RelayEnvironmentProvider>
    </RemixRelayProvider>
  );
}
