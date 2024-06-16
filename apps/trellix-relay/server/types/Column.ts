import { resolveArrayConnection } from "@pothos/plugin-relay";
import { and, asc, eq, relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { retry } from "lib/retry";
import { builder } from "server/builder";
import invariant from "tiny-invariant";
import { z } from "zod";
import { boards } from "./Board";
import { Item, items } from "./Item";
import { users } from "./User";

export const columns = pgTable(
  "columns",
  {
    id: varchar("id").primaryKey(),
    title: text("title").notNull(),
    rank: text("rank").notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    boardId: varchar("board_id")
      .references(() => boards.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (column) => ({
    boardIdx: index("column_board_idx").on(column.boardId),
    rankIdx: index("column_rank_idx").on(column.rank),
  }),
);

export const columnRelations = relations(columns, ({ one, many }) => ({
  user: one(users, { fields: [columns.userId], references: [users.id] }),
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
  items: many(items),
}));

export type Column = typeof columns.$inferSelect;

export const Column = builder.node("Column", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    title: t.exposeString("title"),
    rank: t.exposeString("rank"),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
    itemConnection: t.connection({
      type: Item,
      resolve: async ({ id }, args, { db }) => {
        const data = await db((tx) =>
          tx.query.items.findMany({
            where: eq(items.columnId, id),
            orderBy: asc(items.rank),
          }),
        );

        return resolveArrayConnection({ args }, data);
      },
    }),
  }),
});

builder.subscriptionFields((t) => ({
  column: t.field({
    type: Column,
    args: {
      id: t.arg.id({ required: true }),
    },
    subscribe: (_parent, { id }, { pubsub, user, tabId }) => {
      return pubsub.asyncIterableIterator<Column>({
        table: "columns",
        eventType: "UPDATE",
        id: fromGlobalId(id),
        userId: user.id,
        tabId,
      });
    },
    resolve: (column) => column,
  }),
}));

builder.mutationFields((t) => ({
  createOneColumn: t.field({
    type: Column,
    args: {
      id: t.arg.id({
        required: true,
        validate: (value) => {
          const parts = value.toString().split(":");
          return !!(
            parts.length === 2 &&
            z.string().uuid().parse(parts[0]) &&
            z.string().cuid2().parse(parts[1])
          );
        },
      }),
      title: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(50) },
      }),
      boardId: t.arg.id({ required: true }),
      rank: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [column] = await db(async (tx) => {
        const board = await tx.query.boards.findFirst({
          where: eq(boards.id, fromGlobalId(args.boardId)),
          columns: { userId: true },
        });

        invariant(board?.userId === user.id, "Unauthorized");

        return tx
          .insert(columns)
          .values({
            id: args.id.toString(),
            title: args.title,
            rank: args.rank,
            userId: user.id,
            boardId: fromGlobalId(args.boardId),
          })
          .returning();
      });

      return exists(column, "Column not found");
    },
  }),
  updateOneColumn: t.field({
    type: Column,
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string(),
      rank: t.arg.string(),
    },
    resolve: async (_parent, args, { db, user }) =>
      retry(async () => {
        const [column] = await db((tx) =>
          tx
            .update(columns)
            .set({
              title: args.title ?? undefined,
              rank: args.rank ?? undefined,
            })
            .where(
              and(
                eq(columns.id, fromGlobalId(args.id)),
                eq(columns.userId, user.id),
              ),
            )
            .returning(),
        );

        return exists(column, "Column not found");
      }),
  }),
  deleteOneColumn: t.field({
    type: Column,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) =>
      retry(async () => {
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
      }),
  }),
}));
