#!/usr/bin/env zx

/* eslint-disable turbo/no-undeclared-env-vars */
import { format } from "date-fns";
import { snakeCase } from "lodash-es";
import invariant from "tiny-invariant";
import { $, question, fs, path } from "zx";

process.env.FORCE_COLOR = "1";

const name = snakeCase(await question("Migration name: "));
const newFilename = `${format(new Date(), "yyyyMMddHHmmss")}_${name}`;

const result = await $`drizzle-kit generate --name ${name}`.pipe(
  process.stdout,
);

const lastLine = result.stdout.split("\n").filter(Boolean).pop();

if (lastLine?.includes("Your SQL migration file")) {
  const oldFilename = /(?<=migrations\/)[^.]+/.exec(lastLine)?.[0];

  invariant(oldFilename);

  await fs.rename(
    path.join(import.meta.dirname, `../migrations/${oldFilename}.sql`),
    path.join(import.meta.dirname, `../migrations/${newFilename}.sql`),
  );

  const journalPath = path.join(
    import.meta.dirname,
    "../migrations/meta/_journal.json",
  );

  const journal = await fs.readFile(journalPath, "utf-8");

  await fs.writeFile(journalPath, journal.replace(oldFilename, newFilename));

  console.log();
  console.log(`Wrote ${newFilename}.sql`);
}
