import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createSchema, createYoga } from "graphql-yoga";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "world",
    },
  },
});

const yoga = createYoga({ schema });

export async function loader({ request }: LoaderFunctionArgs) {
  return yoga.handleRequest(request, {});
}

export async function action({ request }: ActionFunctionArgs) {
  return yoga.handleRequest(request, {});
}
