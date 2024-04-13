import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { yoga } from "~/lib/yoga";

export async function loader({ request }: LoaderFunctionArgs) {
  return yoga.handleRequest(request, {});
}

export async function action({ request }: ActionFunctionArgs) {
  return yoga.handleRequest(request, {});
}
