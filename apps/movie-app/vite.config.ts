import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import relay from "vite-plugin-relay";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    relay,
    reactRouter(),
    babel({
      filter: /\.tsx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react/compiler-runtime",
        "react-dom",
        "react-dom/server",
        "react-relay",
        "relay-runtime",
      ],
    },
  },
});
