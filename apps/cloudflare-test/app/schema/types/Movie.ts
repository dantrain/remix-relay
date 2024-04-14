import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { builder } from "../builder";
import { relations } from "drizzle-orm";
import { reviews } from "./Review";
import { drizzle } from "drizzle-orm/d1";
import { resolveArrayConnection } from "@pothos/plugin-relay";

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
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    title: t.exposeString("title"),
    criticScore: t.exposeInt("criticScore"),
    audienceScore: t.exposeInt("audienceScore"),
    criticsConsensus: t.exposeString("criticsConsensus"),
    boxOffice: t.exposeString("boxOffice"),
    imgUrl: t.exposeString("imgUrl"),
  }),
});

builder.queryField("movies", (t) =>
  t.connection({
    type: Movie,
    resolve: async (_parent, args, ctx) => {
      const db = drizzle(ctx.DB);
      const result = await db.select().from(movies).all();

      return resolveArrayConnection({ args }, result);
    },
  }),
);
