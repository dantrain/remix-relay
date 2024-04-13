#!/usr/bin/env zx
/* eslint-disable turbo/no-undeclared-env-vars */
import { $ } from "zx";

process.env.FORCE_COLOR = "1";

process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("uncaughtException", () => {
  process.exit(0);
});

$`remix vite:dev --port 4000 --strictPort`.pipe(process.stdout);
$`watchman-make -p 'app/graphql/**/*.ts' --run 'pnpm write-graphql-schema'`;
$`relay-compiler --watch`;
