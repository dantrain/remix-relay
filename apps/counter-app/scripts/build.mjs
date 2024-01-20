#!/usr/bin/env zx
import { $ } from "zx";

await $`pnpm exec remix vite:build`;
await $`pnpm exec tsup`;
