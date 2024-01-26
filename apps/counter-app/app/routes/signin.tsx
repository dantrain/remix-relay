import { Button } from "@remix-relay/ui";
import { AppLoadContext, MetaFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { Provider } from "@supabase/supabase-js";
import { useState } from "react";
import { GitHubIcon, GoogleIcon } from "~/components/Icons";

export const meta: MetaFunction = () => [{ title: "Sign in · Counter App" }];

export const headers = () => ({ "Cache-Control": "no-store" });

export const loader = ({ context }: { context: AppLoadContext }) => {
  if (context.apolloContext.user) {
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
    <div className="flex min-h-[30dvh] flex-col items-center justify-center gap-4">
      <Button
        className="flex items-center gap-3 px-6 py-2"
        disabled={signingIn}
        onClick={() => signIn("google")}
      >
        <GoogleIcon />
        Sign in with Google
      </Button>
      <Button
        className="flex items-center gap-3 px-6 py-2"
        disabled={signingIn}
        onClick={() => signIn("github")}
      >
        <GitHubIcon />
        Sign in with GitHub
      </Button>
    </div>
  );
}
