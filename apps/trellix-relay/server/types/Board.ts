import { and, eq, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import exists from "server/lib/exists";
import { fromGlobalId } from "server/lib/global-id";
import { z } from "zod";
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

builder.mutationFields((t) => ({
  createOneBoard: t.field({
    type: Board,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: z.string().cuid2() },
      }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [board] = await db((tx) =>
        tx
          .insert(boards)
          .values({
            id: args.id.toString(),
            name: args.name,
            userId: user.id,
          })
          .returning(),
      );

      return exists(board, "Board not found");
    },
  }),
  updateOneBoard: t.field({
    type: Board,
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [board] = await db((tx) =>
        tx
          .update(boards)
          .set({ name: args.name })
          .where(
            and(
              eq(boards.id, fromGlobalId(args.id)),
              eq(boards.userId, user.id),
            ),
          )
          .returning(),
      );

      return exists(board, "Board not found");
    },
  }),
  deleteOneBoard: t.field({
    type: Board,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [board] = await db((tx) =>
        tx
          .delete(boards)
          .where(
            and(
              eq(boards.id, fromGlobalId(args.id)),
              eq(boards.userId, user.id),
            ),
          )
          .returning(),
      );

      return exists(board, "Board not found");
    },
  }),
}));
