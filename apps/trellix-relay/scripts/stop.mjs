#!/usr/bin/env zx
import { $ } from "zx";

await $`supabase stop --no-backup`;
await $`docker volume ls --filter label=com.supabase.cli.project=web -q | xargs -r docker volume rm`;
