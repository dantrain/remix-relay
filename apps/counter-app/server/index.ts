/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import { SupabaseClient, User } from "@supabase/supabase-js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import path from "path";
import { WebSocketServer } from "ws";
import { createSupabaseClient } from "./create-supabase-client";
import { env } from "./env";
import { schema } from "./graphql/schema";
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

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const pubsub = new PubSub();

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      const supabase = createSupabaseClient(ctx.extra.request, null, {
        writeCookies: false,
      });

      const { data } = await supabase.auth.getSession();

      return { pubsub, supabase, user: data.session?.user };
    },
  },
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
  const supabase = createSupabaseClient(req, res);

  const { data } = await supabase.auth.getSession();

  req.context = req.context || {};

  req.context.supabase = supabase;
  req.context.user = data.session?.user ?? null;

  next();
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  if (code) {
    await req.context.supabase.auth.exchangeCodeForSession(code as string);
  } else {
    return res.redirect(303, "/signin");
  }

  return res.redirect(303, "/");
});

app.get("/auth/signout", async (req, res) => {
  await req.context.supabase.auth.signOut();
  return res.redirect(303, "/signin");
});

app.use((req, res, next) => {
  if (!req.context.user) {
    if (req.path === "/signin") {
      return next();
    } else if (req.path === "/graphql") {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      return res.redirect(303, "/signin");
    }
  }

  return next();
});

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      return { pubsub, ...req.context };
    },
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
