import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["server/index.ts"],
  outDir: "build/server",
  format: "esm",
  splitting: false,
  external: ["lightningcss"],
});
