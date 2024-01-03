import { ApolloServer } from "@apollo/server";
import { schema } from "~/graphql/graphql-schema";

const server = new ApolloServer({
  schema,
});

export async function getServer() {
  try {
    server.assertStarted("Server not started");
  } catch (e) {
    await server.start();
  }

  return server;
}
