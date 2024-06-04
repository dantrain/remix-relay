#!/usr/bin/env zx
import { snakeCase } from "lodash-es";
import { $, question } from "zx";

const name = snakeCase(await question("Migration name: "));

await $`supabase start -x storage-api,imgproxy,inbucket,edge-runtime,logflare,vector,pg_prove`;

$`supabase db diff -f ${name}`;
