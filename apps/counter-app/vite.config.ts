import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    tsconfigPaths(),
    cjsInterop({
      dependencies: ["react-relay"],
    }),
    relay,
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverBuildFile: "remix.js",
      future: {
        v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
  ssr: command === "build" ? { noExternal: /(relay)/ } : {},
}));
