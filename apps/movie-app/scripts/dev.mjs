#!/usr/bin/env zx
import { $ } from "zx";

$`pnpm exec remix vite:dev`;
$`watchman-make -p 'app/graphql/**/*.ts' --run 'pnpm write-graphql-schema'`;
