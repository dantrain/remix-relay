#!/usr/bin/env zx
/* eslint-disable turbo/no-undeclared-env-vars */
import "@dotenvx/dotenvx/config";
import { throttle } from "lodash-es";
import { $ } from "zx";

process.env.FORCE_COLOR = "1";

const exit = throttle(() => process.exit(0), 5 * 60 * 1000);

process.on("SIGTERM", exit);
process.on("SIGINT", exit);
process.on("uncaughtException", exit);

await $`supabase start -x storage-api,imgproxy,inbucket,edge-runtime,logflare,vector`;

const supabaseParams = JSON.parse(
  (await $`supabase status -o json`.quiet()).stdout,
);

process.env.NODE_ENV = "development";
process.env.SUPABASE_PUBLISHABLE_KEY = supabaseParams.PUBLISHABLE_KEY;
process.env.SUPABASE_SECRET_KEY = supabaseParams.SECRET_KEY;

$`node --import tsx/esm --watch-path=./server ./server/index.ts`.pipe(
  process.stdout,
);
$`watchman-make -p 'server/types/**/*.ts' --run 'pnpm write-graphql-schema'`;
$`relay-compiler --watch`;
