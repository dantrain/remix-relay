import { AppLoadContext, MetaFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import type { Provider } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@remix-relay/ui";
import Anchor from "~/components/Anchor";
import { GitHubIcon } from "~/components/Icons";
import { Logo } from "~/components/Logo";
import { Spinner } from "~/components/Spinner";

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
      className="grid h-[100dvh] grid-cols-[1fr_minmax(auto,32rem)_1fr]
        grid-rows-[minmax(60px,1fr)_auto_3fr] bg-slate-900 text-lg
        text-slate-100"
    >
      <div className="col-start-2 row-start-2 p-4">
        <Logo />
        <div className="mb-12 flex flex-col gap-4">
          <p>
            This is a demo app to show off the features of{" "}
            <Anchor href="https://github.com/dantrain/remix-relay">
              remix-relay
            </Anchor>
            . It's a recreation Ryan Florence's{" "}
            <Anchor href="https://trellix.fly.dev/">Trellix</Anchor> demo.
          </p>
          <p>If you want to play around, click sign in!</p>
        </div>
        <div className="flex justify-center">
          <Button
            className="flex items-center justify-center gap-3 px-6 py-2
              ring-offset-slate-900"
            variant="sky"
            disabled={signingIn}
            onPress={() => signIn("github")}
          >
            {signingIn ? <Spinner /> : <GitHubIcon />}Sign in with GitHub
          </Button>
        </div>
      </div>
    </main>
  );
}
