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

$`NODE_ENV=development node --import tsx/esm --watch-path=./app/graphql --watch-path=./server ./server/index.ts`;
$`watchman-make -p 'app/graphql/**/*.ts' --run 'pnpm write-graphql-schema'`;
$`relay-compiler --watch`;
