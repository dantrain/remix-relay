/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient, User } from "@supabase/supabase-js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import path from "path";
import { WebSocketServer } from "ws";
import { env } from "./env";
import { schema } from "./graphql/graphql-schema";
import { PubSub } from "./pubsub";

export type RequestContext = {
  supabase: SupabaseClient;
  user: User | null;
};

export type ApolloContext = RequestContext & {
  pubsub: PubSub;
};

installGlobals();

const isProd = env.NODE_ENV === "production";

const viteDevServer = isProd
  ? null
  : await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );

const app = express();
const httpServer = createServer(app);

app.use(cookieParser());

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static(
      path.join(
        import.meta.dirname!,
        isProd ? "../" : "../build",
        "client/assets",
      ),
      {
        immutable: true,
        maxAge: "1y",
      },
    ),
  );
}

app.use(
  express.static(
    path.join(import.meta.dirname!, isProd ? "../" : "../build", "client"),
    {
      maxAge: "1h",
    },
  ),
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

const apolloServer = new ApolloServer<ApolloContext>({
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

app.use(async (req, res, next) => {
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        const cookie = req.cookies[key] ?? "";
        return decodeURIComponent(cookie);
      },
      set: (key, value, options) => {
        if (!res) return;
        res.cookie(key, encodeURIComponent(value), {
          ...options,
          sameSite: "lax",
          httpOnly: true,
        });
      },
      remove: (key, options) => {
        if (!res) return;
        res.cookie(key, "", { ...options, httpOnly: true });
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  req.context = req.context || {};

  req.context.supabase = supabase;
  req.context.user = data.user;

  next();
});

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => ({ pubsub, ...req.context }),
  }),
);

app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
      : ((await import(
          path.join(import.meta.dirname!, "remix.js")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any),
    getLoadContext(req) {
      return { env, apolloServer, apolloContext: { pubsub, ...req.context } };
    },
  }),
);

httpServer.listen(env.PORT, () => {
  console.log(`🚀 App running at http://localhost:${env.PORT}`);
  console.log(
    `🚀 Query endpoint ready at http://localhost:${env.PORT}/graphql`,
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${env.PORT}/graphql`,
  );
});
