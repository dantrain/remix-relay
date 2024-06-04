#!/usr/bin/env zx

/* eslint-disable turbo/no-undeclared-env-vars */
import { $ } from "zx";

process.env.FORCE_COLOR = "1";

await $`pnpm write-graphql-schema`;
await $`relay-compiler`;
await $`pnpm exec remix vite:build`;
await $`pnpm exec tsup`;
