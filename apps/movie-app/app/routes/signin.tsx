import { Form, MetaFunction, redirect, useNavigation } from "react-router";
import { Button } from "@remix-relay/ui";
import { authenticate } from "~/lib/auth.server";
import { Route } from ".react-router/types/app/routes/+types/signin";

export const meta: MetaFunction = () => [{ title: "Sign in - Movie App" }];

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await authenticate(request, context);

  if (user) {
    return redirect("/");
  }

  return null;
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
