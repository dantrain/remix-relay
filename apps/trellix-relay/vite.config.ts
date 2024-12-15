import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    tsconfigPaths(),
    cjsInterop({
      dependencies: ["react-relay", "@mui/base"],
    }),
    relay,
    reactRouter(),
  ],
  ssr: command === "build" ? { noExternal: /(relay|@mui)/ } : {},
}));
