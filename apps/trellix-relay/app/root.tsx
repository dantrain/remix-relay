import { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { TriangleAlertIcon } from "lucide-react";
import { ReactNode, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { useDocumentTitle } from "usehooks-ts";
import { RemixRelayProvider } from "@remix-relay/react";
import { Toaster } from "@remix-relay/ui";
import { getCurrentEnvironment } from "~/lib/relay-environment";
import Progress from "./components/Progress";
import { ResubscribeProvider } from "./components/ResubscribeProvider";
import { Spinner } from "./components/Spinner";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function Layout({ children }: { children: ReactNode }) {
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
        <ResubscribeProvider>
          <Progress />
          <Suspense fallback={<Spinner className="mx-auto h-36" />}>
            <Outlet />
          </Suspense>
          <Toaster variant="light" />
        </ResubscribeProvider>
      </RelayEnvironmentProvider>
    </RemixRelayProvider>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  const message = isRouteError
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown Error";

  const heading = isRouteError ? "Page not found" : "Something went wrong";

  useDocumentTitle(`${heading} | Trellix Relay`);

  return (
    <main
      className="grid min-h-[100dvh]
        grid-cols-[minmax(1rem,1fr)_auto_minmax(1rem,1fr)]
        grid-rows-[minmax(1rem,1fr)_auto_minmax(1rem,3fr)] justify-center"
    >
      <div
        className="col-start-2 row-start-2 grid max-w-[768px] gap-6 rounded-md
          border border-slate-300 bg-white px-4 py-6 shadow-sm sm:p-8"
      >
        <h1 className="flex items-center justify-center gap-2 text-2xl">
          <TriangleAlertIcon className="text-red-700" />
          {heading}
        </h1>
        <pre className="overflow-auto rounded-sm bg-slate-200 p-2 text-center">
          {message}
        </pre>
      </div>
    </main>
  );
}
