/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import path from "path";
import invariant from "tiny-invariant";
import { WebSocketServer } from "ws";
import { createSupabaseClient } from "./create-supabase-client";
import { getDb } from "./drizzle-client";
import { env } from "./env";
import { schema } from "./graphql-schema";
import { PubSub } from "./pubsub";

export type RequestContext = {
  supabase: SupabaseClient;
  session?: Session;
};

export type PothosContext = {
  pubsub: PubSub;
  supabase: SupabaseClient;
  db: ReturnType<typeof getDb>;
  user: User;
  tabId?: string;
};

installGlobals();

const isProd = env.NODE_ENV === "production";

const viteDevServer = isProd
  ? null
  : await import("vite").then((vite) =>
      vite.createServer({
        server: {
          middlewareMode: true,
          hmr: { port: env.PORT + 1 },
        },
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
    context: async (ctx, { payload }) => {
      const supabase = createSupabaseClient(ctx.extra.request, null, {
        writeCookies: false,
      });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      invariant(session?.user, "Missing user");

      return {
        pubsub,
        supabase,
        db: session && getDb(session),
        user: session?.user,
        tabId: payload.extensions?.tabId,
      };
    },
  },
  wsServer,
);

const apolloServer = new ApolloServer<PothosContext>({
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
  req.context.session = data.session ?? undefined;

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
  if (!req.context.session?.user) {
    if (req.path === "/signin") {
      return next();
    } else if (req.path === "/graphql") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    } else {
      res.redirect(303, "/signin");
      return;
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
      const { session, supabase } = req.context;
      invariant(session?.user, "Missing user");

      return {
        pubsub,
        supabase,
        db: session && getDb(session),
        user: session.user,
        tabId: req.body.extensions?.tabId,
      };
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
      const { session, supabase } = req.context;

      return {
        env,
        pothosContext: {
          pubsub,
          supabase,
          db: session && getDb(session),
          user: session?.user,
        },
      };
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
