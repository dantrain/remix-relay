import { expressMiddleware } from "@apollo/server/express4";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import cors from "cors";
import express from "express";
import "express-async-errors";
import path from "path";
import { getServer } from "../app/lib/apollo-server";

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

const apolloServer = await getServer();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer),
);

app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
      : ((await import(
          path.join(import.meta.dirname!, "../build/server/remix.js")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any),
    getLoadContext() {
      return { apolloServer };
    },
  }),
);

const port = 3000;

app.listen(port, () => console.log("http://localhost:" + port));
