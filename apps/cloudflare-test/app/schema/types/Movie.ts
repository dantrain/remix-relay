import { resolveArrayConnection } from "@pothos/plugin-relay";
import { eq, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { builder } from "../builder";
import { Review, reviews } from "./Review";
import invariant from "tiny-invariant";

export const movies = sqliteTable("movies", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  criticScore: integer("critic_score").notNull(),
  audienceScore: integer("audience_score").notNull(),
  criticsConsensus: text("critics_consensus").notNull(),
  boxOffice: text("box_office").notNull(),
  imgUrl: text("img_url").notNull(),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  reviews: many(reviews),
}));

export type Movie = typeof movies.$inferSelect;

export const Movie = builder.node("Movie", {
  isTypeOf: () => true,
  id: { resolve: (_) => _.id },
  loadOne: async (id, { db }) => {
    const result = await db.query.movies.findFirst({
      where: eq(movies.id, id),
    });

    invariant(result, "Movie not found");
    return result;
  },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    title: t.exposeString("title"),
    criticScore: t.exposeInt("criticScore"),
    audienceScore: t.exposeInt("audienceScore"),
    criticsConsensus: t.exposeString("criticsConsensus"),
    boxOffice: t.exposeString("boxOffice"),
    imgUrl: t.exposeString("imgUrl"),
    reviews: t.connection({
      type: Review,
      resolve: async ({ id }, args, { db }) => {
        const result = await db.query.reviews.findMany({
          where: eq(reviews.movieId, id),
        });

        return resolveArrayConnection({ args }, result);
      },
    }),
  }),
});

builder.queryField("movie", (t) =>
  t.field({
    type: Movie,
    args: {
      slug: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { slug }, { db }) => {
      const result = await db.query.movies.findFirst({
        where: eq(movies.slug, slug),
      });

      invariant(result, "Movie not found");
      return result;
    },
  }),
);

builder.queryField("movies", (t) =>
  t.connection({
    type: Movie,
    resolve: async (_parent, args, { db }) => {
      const result = await db.query.movies.findMany();

      return resolveArrayConnection({ args }, result);
    },
  }),
);
