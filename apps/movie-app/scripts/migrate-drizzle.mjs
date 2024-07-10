#!/usr/bin/env zx

/* eslint-disable turbo/no-undeclared-env-vars */
import { snakeCase } from "lodash-es";
import { $, question } from "zx";

process.env.FORCE_COLOR = "1";

const name = snakeCase(await question("Migration name: "));

await $`drizzle-kit generate --name ${name}`.pipe(process.stdout);
