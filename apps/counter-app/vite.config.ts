import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import relay from "vite-plugin-relay";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig(({ command }) => ({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverBuildPath: "build/server/remix.js",
    }),
    tsconfigPaths(),
    relay,
  ],
  ssr: command === "build" ? { noExternal: /(relay)/ } : {},
}));