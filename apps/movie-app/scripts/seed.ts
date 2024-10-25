import { createId } from "@paralleldrive/cuid2";
import Database from "better-sqlite3";
import { Query } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { omit } from "lodash-es";
import { $ } from "zx";
import * as schema from "../app/schema/db-schema";
import data from "../data/seed-data.json";

function combineQueryAndParams(query: Query) {
  return query.params
    .reduce((acc: string, param) => {
      return acc.replace(
        /(?<!\\)\?/,
        typeof param === "string"
          ? `'${param.replaceAll("'", "''").replaceAll("?", "\\?")}'`
          : `${param}`,
      );
    }, query.sql)
    .replaceAll("\\?", "?");
}

const dataWithIds = data.map((movie) => ({
  id: createId(),
  ...movie,
  reviews: movie.reviews.map((review) => ({ id: createId(), ...review })),
}));

const db = drizzle(new Database(), { schema, casing: "snake_case" });

const moviesSql = combineQueryAndParams(
  db
    .insert(schema.movies)
    .values(dataWithIds.map((movie) => omit(movie, ["reviews"])))
    .toSQL(),
);

const reviewsSql = combineQueryAndParams(
  db
    .insert(schema.reviews)
    .values(
      dataWithIds
        .map((movie) =>
          movie.reviews.map((review) => ({ ...review, movieId: movie.id })),
        )
        .flat(),
    )
    .toSQL(),
);

console.log(moviesSql);
await $`wrangler d1 execute DB --local --command ${moviesSql}`;

console.log(reviewsSql);
await $`wrangler d1 execute DB --local --command ${reviewsSql}`;
