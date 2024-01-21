import { Button } from "@remix-relay/ui";
import { AppLoadContext, MetaFunction, redirect } from "@remix-run/node";
import { useContext, useState } from "react";
import invariant from "tiny-invariant";
import { SupabaseContext } from "~/root";

export const meta: MetaFunction = () => [{ title: "Sign in · Counter App" }];

export const headers = () => ({ "Cache-Control": "no-store" });

export const loader = ({ context }: { context: AppLoadContext }) => {
  if (context.apolloContext.user) {
    return redirect("/", {
      status: 303,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return null;
};

export default function SignIn() {
  const supabase = useContext(SupabaseContext);

  const [signingIn, setSigningIn] = useState(false);

  const signIn = async () => {
    setSigningIn(true);
    invariant(supabase);

    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (res.error) {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-[30dvh] items-center justify-center">
      <Button className="px-6 py-2" disabled={signingIn} onClick={signIn}>
        Sign in with Google
      </Button>
    </div>
  );
}
