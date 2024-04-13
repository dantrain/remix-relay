import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { RelayEnvironmentProvider } from "react-relay";
import { getCurrentEnvironment } from "./lib/relay-environment";
import { RemixRelayProvider } from "@remix-relay/react";
import { Suspense } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RemixRelayProvider>
          <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
            <Suspense>{children}</Suspense>
          </RelayEnvironmentProvider>
        </RemixRelayProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
