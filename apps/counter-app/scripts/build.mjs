#!/usr/bin/env zx
import { $ } from "zx";

await $`pnpm write-graphql-schema`;
await $`relay-compiler`;
await $`pnpm exec remix vite:build`;
await $`pnpm exec tsup`;
