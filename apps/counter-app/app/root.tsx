import { RemixRelayProvider } from "@remix-relay/react";
import { Spinner } from "@remix-relay/ui";
import "@remix-relay/ui/dist/index.css";
import type { AppLoadContext } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Suspense, createContext, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getCurrentEnvironment } from "~/lib/relay-environment";
import Progress from "./components/Progress";
import "./tailwind.css";

export const loader = ({ context }: { context: AppLoadContext }) => {
  return json({
    SUPABASE_URL: context.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: context.env.SUPABASE_ANON_KEY,
  });
};

export const SupabaseContext = createContext<SupabaseClient | null>(null);

export default function App() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = useLoaderData<typeof loader>();

  // eslint-disable-next-line react/hook-use-state
  const [supabase] = useState(() =>
    createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY),
  );

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
        <SupabaseContext.Provider value={supabase}>
          <RemixRelayProvider>
            <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
              <Progress />
              <div className="mx-auto max-w-3xl p-4 sm:p-8">
                <Suspense fallback={<Spinner className="h-36" />}>
                  <Outlet />
                </Suspense>
              </div>
            </RelayEnvironmentProvider>
          </RemixRelayProvider>
        </SupabaseContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
