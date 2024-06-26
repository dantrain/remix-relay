import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, MetaFunction, useNavigation } from "@remix-run/react";
import { Button } from "@remix-relay/ui";
import { getAuthenticator } from "~/lib/auth.server";

export const meta: MetaFunction = () => [{ title: "Sign in - Movie App" }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  return getAuthenticator(context).isAuthenticated(request, {
    successRedirect: "/",
  });
}

export default function SignIn() {
  const navigation = useNavigation();

  return (
    <Form
      className="flex flex-col items-center py-20"
      action="/auth/github"
      method="post"
    >
      <Button
        className="py-3 pl-5 pr-6"
        type="submit"
        disabled={navigation.state !== "idle"}
      >
        <span className="mr-3">🔑</span>Sign in with GitHub
      </Button>
    </Form>
  );
}
