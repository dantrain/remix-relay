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
import { Spinner } from "@remix-relay/ui";
import { getCurrentEnvironment } from "./lib/relay-environment";
import "./tailwind.css";

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
  return (
    <RemixRelayProvider>
      <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
        <div className="mx-auto max-w-3xl p-4 sm:p-8">
          <Suspense fallback={<Spinner className="h-36" />}>
            <Outlet />
          </Suspense>
        </div>
      </RelayEnvironmentProvider>
    </RemixRelayProvider>
  );
}
