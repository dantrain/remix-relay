import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { movies } from "./Movie";
import { users } from "./User";

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

export type UserToMovie = typeof usersToMovies.$inferSelect;
