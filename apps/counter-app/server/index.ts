/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import path from "path";
import { WebSocketServer } from "ws";
import { schema } from "./graphql/graphql-schema";

const mode = process.env.NODE_ENV as "development" | "production";

installGlobals();

const viteDevServer =
  mode === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const app = express();
const httpServer = createServer(app);

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static(path.join(import.meta.dirname!, "../build/client/assets"), {
      immutable: true,
      maxAge: "1y",
    }),
  );
}

app.use(
  express.static(path.join(import.meta.dirname!, "../build/client"), {
    maxAge: "1h",
  }),
);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const pubsub = new PubSub();

const serverCleanup = useServer(
  { schema, context: () => ({ pubsub }) },
  wsServer,
);

const apolloServer = new ApolloServer<{ pubsub: PubSub }>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer, { context: async () => ({ pubsub }) }),
);

app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
      : ((await import(
          path.join(import.meta.dirname!, "../build/server/index.js")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any),
    getLoadContext() {
      return { apolloServer };
    },
  }),
);

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 App running at http://localhost:${PORT}`);
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`,
  );
});
