import { AppLoadContext, MetaFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import type { Provider } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@remix-relay/ui";
import { GitHubIcon } from "~/components/Icons";

export const meta: MetaFunction = () => [{ title: "Sign in · Trellix Relay" }];

export const headers = () => ({ "Cache-Control": "no-store" });

export const loader = ({ context }: { context: AppLoadContext }) => {
  if (context.pothosContext.user) {
    return redirect("/", {
      status: 303,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return json({
    SUPABASE_URL: context.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: context.env.SUPABASE_ANON_KEY,
  });
};

export default function SignIn() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = useLoaderData<typeof loader>();

  // eslint-disable-next-line react/hook-use-state
  const [supabase] = useState(() =>
    createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY),
  );

  const [signingIn, setSigningIn] = useState(false);

  const signIn = async (provider: Provider) => {
    setSigningIn(true);

    const res = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (res.error) {
      setSigningIn(false);
    }
  };

  return (
    <main
      className="grid min-h-[100dvh] grid-cols-[1fr_minmax(auto,32rem)_1fr]
        grid-rows-[minmax(100px,1fr)_auto_2fr] bg-slate-950 text-lg
        text-slate-100"
    >
      <div className="col-start-2 row-start-2 p-4">
        <div className="mb-12 flex flex-col gap-4">
          <p>This is a demo app to show off the features of remix-relay.</p>
          <p>
            It's a recreation of the popular drag and drop interface in{" "}
            <a href="https://trello.com/">Trello</a> and other similar apps.
          </p>
          <p>If you want to play around, click sign in!</p>
        </div>
        <div className="flex justify-center">
          <Button
            className="flex items-center justify-center gap-3 px-6 py-2"
            color="slate"
            disabled={signingIn}
            onClick={() => signIn("github")}
          >
            <GitHubIcon />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </main>
  );
}
