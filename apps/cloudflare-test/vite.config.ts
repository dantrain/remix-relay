import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    cjsInterop({
      dependencies: ["react-relay"],
    }),
    relay,
    remix(),
    tsconfigPaths(),
  ],
});
