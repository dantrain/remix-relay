import { and, eq, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { builder } from "server/builder";
import exists from "server/lib/exists";
import { fromGlobalId } from "server/lib/global-id";
import { z } from "zod";
import { boards } from "./Board";
import { users } from "./User";

export const columns = pgTable("columns", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  boardId: varchar("board_id")
    .references(() => boards.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const columnRelations = relations(columns, ({ one }) => ({
  user: one(users, { fields: [columns.userId], references: [users.id] }),
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
}));

export type Column = typeof columns.$inferSelect;

export const Column = builder.node("Column", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    title: t.exposeString("title"),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
  }),
});

builder.mutationFields((t) => ({
  createOneColumn: t.field({
    type: Column,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: z.string().cuid2() },
      }),
      title: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(50) },
      }),
      boardId: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [column] = await db((tx) =>
        tx
          .insert(columns)
          .values({
            id: args.id.toString(),
            title: args.title,
            userId: user.id,
            boardId: fromGlobalId(args.boardId),
          })
          .returning(),
      );
      return exists(column, "Column not found");
    },
  }),
  deleteOneColumn: t.field({
    type: Column,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [column] = await db((tx) =>
        tx
          .delete(columns)
          .where(
            and(
              eq(columns.id, fromGlobalId(args.id)),
              eq(columns.userId, user.id),
            ),
          )
          .returning(),
      );

      return exists(column, "Column not found");
    },
  }),
}));
