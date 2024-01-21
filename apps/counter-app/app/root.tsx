import { RemixRelayProvider } from "@remix-relay/react";
import { Button, Spinner } from "@remix-relay/ui";
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
import { Suspense, useState } from "react";
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

export default function App() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = useLoaderData<typeof loader>();

  // eslint-disable-next-line react/hook-use-state
  const [supabase] = useState(() =>
    createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY),
  );

  const signUp = async () => {
    const res = await supabase.auth.signUp({
      email: "dantrain@gmail.com",
      password: "testing123",
    });

    console.log("signUp res", res);
  };

  const signIn = async () => {
    const res = await supabase.auth.signInWithPassword({
      email: "dantrain@gmail.com",
      password: "testing123",
    });

    console.log("signIn res", res);
  };

  const signOut = async () => {
    const res = await supabase.auth.signOut();

    console.log("signOut res", res);
  };

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
            <Progress />
            <div className="mx-auto max-w-3xl p-4 sm:p-8">
              <div className="mb-8 flex gap-4">
                <Button onClick={signUp}>Sign up</Button>
                <Button onClick={signIn}>Sign in</Button>
                <Button onClick={signOut}>Sign out</Button>
              </div>
              <Suspense fallback={<Spinner className="h-36" />}>
                <Outlet />
              </Suspense>
            </div>
          </RelayEnvironmentProvider>
        </RemixRelayProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
