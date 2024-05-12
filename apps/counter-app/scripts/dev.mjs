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

$`NODE_ENV=development node --import tsx/esm --watch-path=./server ./server/index.ts`.pipe(
  process.stdout,
);
$`watchman-make -p 'server/graphql/**/*.ts' --run 'pnpm write-graphql-schema'`;
$`relay-compiler --watch`;
