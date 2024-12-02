import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflareDevProxy(),
    cjsInterop({
      dependencies: ["react-relay"],
    }),
    relay,
    reactRouter(),
    tsconfigPaths(),
  ],
});
