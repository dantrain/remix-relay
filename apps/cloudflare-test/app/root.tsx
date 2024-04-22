import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { Suspense, createContext } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { RemixRelayProvider } from "@remix-relay/react";
import { Button, Spinner } from "@remix-relay/ui";
import { authenticator } from "./lib/auth.server";
import { getCurrentEnvironment } from "./lib/relay-environment";
import { User } from "./schema/types/User";
import "./tailwind.css";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.isAuthenticated(request);
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}

export const UserContext = createContext<User | null>(null);

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

export default function App() {
  const location = useLocation();
  const user = useLoaderData<typeof loader>();

  return (
    <UserContext.Provider value={user}>
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
    </UserContext.Provider>
  );
}
