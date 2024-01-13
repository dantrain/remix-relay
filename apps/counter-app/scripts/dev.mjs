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

$`NODE_ENV=development pnpm exec tsx ./server.ts`;
$`watchman-make -p 'app/graphql/**/*.ts' --run 'pnpm write-graphql-schema'`;
$`relay-compiler --watch`;
