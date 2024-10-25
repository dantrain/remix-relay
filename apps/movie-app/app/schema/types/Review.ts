import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { builder } from "../builder";
import { movies } from "./Movie";

export const reviews = sqliteTable(
  "reviews",
  {
    id: text().primaryKey(),
    quote: text().notNull(),
    fresh: integer({ mode: "boolean" }).notNull(),
    criticName: text().notNull(),
    criticSource: text().notNull(),
    movieId: text()
      .references(() => movies.id)
      .notNull(),
  },
  (review) => ({ movieIdx: index("review_movie_id").on(review.movieId) }),
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  movie: one(movies, { fields: [reviews.movieId], references: [movies.id] }),
}));

export type Review = typeof reviews.$inferSelect;

export const Review = builder.node("Review", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    quote: t.exposeString("quote"),
    fresh: t.exposeBoolean("fresh"),
    criticName: t.exposeString("criticName"),
    criticSource: t.exposeString("criticSource"),
  }),
});
