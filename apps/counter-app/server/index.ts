import { expressMiddleware } from "@apollo/server/express4";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import cors from "cors";
import express from "express";
import "express-async-errors";
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
    express.static("../build/client/assets", {
      immutable: true,
      maxAge: "1y",
    }),
  );
}

app.use(express.static("../build/client", { maxAge: "1h" }));

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
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((await import("../build/server/remix.js")) as any),
    getLoadContext() {
      return { apolloServer };
    },
  }),
);

const port = 3000;

app.listen(port, () => console.log("http://localhost:" + port));
