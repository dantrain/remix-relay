import { DeferredQueryProvider } from "@remix-relay/react";
import { Spinner } from "@remix-relay/ui";
import "@remix-relay/ui/dist/index.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getCurrentEnvironment } from "~/lib/relay-environment";
import Progress from "./components/Progress";
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
      <body className="bg-slate-950 text-white">
        <DeferredQueryProvider>
          <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
            <Progress />
            <div className="mx-auto max-w-3xl p-4 sm:p-8">
              <Suspense fallback={<Spinner className="h-36" />}>
                <Outlet />
              </Suspense>
            </div>
          </RelayEnvironmentProvider>
        </DeferredQueryProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
