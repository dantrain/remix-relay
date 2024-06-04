import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { builder } from "../builder";
import { users } from "./User";

export const boards = pgTable("boards", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const boardRelations = relations(boards, ({ one }) => ({
  user: one(users, { fields: [boards.userId], references: [users.id] }),
}));

export type Board = typeof boards.$inferSelect;

export const Board = builder.node("Board", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    name: t.exposeString("name"),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
  }),
});
