import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import {
  Links,
  LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { RemixRelayProvider } from "@remix-relay/react";
import { Spinner, Toaster } from "@remix-relay/ui";
import { getCurrentEnvironment } from "~/lib/relay-environment";
import Progress from "./components/Progress";
import { ResubscribeProvider } from "./hooks/useSubscribe";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Remix + Relay, what a combo" name="description" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-950 text-white">
        <RemixRelayProvider>
          <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
            <ResubscribeProvider>
              <Progress />
              <div className="mx-auto max-w-3xl p-4 sm:p-8">
                <Suspense fallback={<Spinner className="h-36" />}>
                  <Outlet />
                </Suspense>
              </div>
              <Toaster />
            </ResubscribeProvider>
          </RelayEnvironmentProvider>
        </RemixRelayProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
