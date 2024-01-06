import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "@repo/ui/dist/index.css";
import { RelayEnvironmentProvider } from "react-relay";
import { getCurrentEnvironment } from "~/lib/relay-environment";
import Progress from "./components/Progress";
import "./tailwind.css";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Remix + Relay, what a combo" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-950 text-white">
        <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
          <Progress />
          <div className="mx-auto max-w-3xl p-4 sm:p-8">
            <Outlet />
          </div>
        </RelayEnvironmentProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
