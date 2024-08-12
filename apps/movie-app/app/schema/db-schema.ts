import { relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";

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
  usersToMovies: many(usersToMovies),
}));

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    quote: text("quote").notNull(),
    fresh: integer("fresh", { mode: "boolean" }).notNull(),
    criticName: text("critic_name").notNull(),
    criticSource: text("critic_source").notNull(),
    movieId: text("movie_id")
      .references(() => movies.id)
      .notNull(),
  },
  (review) => ({ movieIdx: index("review_movie_id").on(review.movieId) }),
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  movie: one(movies, { fields: [reviews.movieId], references: [movies.id] }),
}));

export const users = sqliteTable("users", {
  email: text("email").primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToMovies: many(usersToMovies),
}));

export type User = typeof users.$inferSelect;

export const usersToMovies = sqliteTable(
  "users_to_movies",
  {
    userEmail: text("user_email")
      .notNull()
      .references(() => users.email),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
    liked: integer("liked", { mode: "boolean" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userEmail, t.movieId] }),
  }),
);

export const usersToMoviesRelations = relations(usersToMovies, ({ one }) => ({
  user: one(users, {
    fields: [usersToMovies.userEmail],
    references: [users.email],
  }),
  movie: one(movies, {
    fields: [usersToMovies.movieId],
    references: [movies.id],
  }),
}));
