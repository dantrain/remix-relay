import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay";

export default defineConfig(({ command }) => ({
  plugins: [
    cjsInterop({
      dependencies: ["react-relay", "@mui/base"],
    }),
    tailwindcss(),
    relay,
    reactRouter(),
    babel({
      include: /\.tsx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: { tsconfigPaths: true },
  ssr: command === "build" ? { noExternal: /(relay|@mui)/ } : {},
}));
