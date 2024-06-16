import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { RemixRelayProvider } from "@remix-relay/react";
import { Spinner, Toaster } from "@remix-relay/ui";
import { getCurrentEnvironment } from "~/lib/relay-environment";
import Progress from "./components/Progress";
import { ResubscribeProvider } from "./components/ResubscribeProvider";
import "./tailwind.css";

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
      <body className="bg-slate-200 text-slate-950">
        <RemixRelayProvider>
          <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
            <ResubscribeProvider>
              <Progress />
              <Suspense fallback={<Spinner className="h-36" />}>
                <Outlet />
              </Suspense>
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
