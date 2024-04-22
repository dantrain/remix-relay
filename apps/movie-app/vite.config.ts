import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay";
import tsconfigPaths from "vite-tsconfig-paths";

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
