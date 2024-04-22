import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersToMovies } from "./UserToMovie";

export const users = sqliteTable("users", {
  email: text("email").primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToMovies: many(usersToMovies),
}));

export type User = typeof users.$inferSelect;
