#!/usr/bin/env zx
import { $ } from "zx";

process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("uncaughtException", () => {
  process.exit(0);
});

$`pnpm exec remix vite:dev`;
$`watchman-make -p 'app/graphql/**/*.ts' --run 'pnpm write-graphql-schema'`;
$`relay-compiler --watch`;
