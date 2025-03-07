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
import { idSchema } from "lib/zod-schemas";
import { builder } from "server/builder";
import rlsPolicy from "server/rls-policy";
import invariant from "tiny-invariant";
import { z } from "zod";
import { boards } from "./Board";
import { Item, items } from "./Item";
import { users } from "./User";

export const columns = pgTable(
  "columns",
  {
    id: varchar().primaryKey(),
    title: text().notNull(),
    rank: text().notNull(),
    userId: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    boardId: varchar()
      .references(() => boards.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedBy: varchar().notNull(),
  },
  (column) => [
    index("column_board_idx").on(column.boardId),
    index("column_rank_idx").on(column.rank),
    rlsPolicy,
  ],
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
    title: t.exposeString("title", { nullable: false }),
    rank: t.exposeString("rank", { nullable: false }),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
    itemConnection: t.connection({
      type: Item,
      nullable: false,
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
  columnCreated: t.field({
    type: Column,
    subscribe: (_parent, _args, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Column>({
        table: "columns",
        eventType: "INSERT",
        userId: user.id,
        tabId,
      }),
    resolve: (column) => column,
  }),
  columnDeleted: t.field({
    type: Column,
    subscribe: (_parent, _args, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Column>({
        table: "columns",
        eventType: "DELETE",
        userId: user.id,
        tabId,
      }),
    resolve: (column) => column,
  }),
}));

builder.mutationFields((t) => ({
  createOneColumn: t.field({
    type: Column,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: idSchema },
      }),
      title: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(50) },
      }),
      boardId: t.arg.id({ required: true }),
      rank: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, { db, user, tabId }) => {
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
            updatedBy: exists(tabId, "Missing tabID"),
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
    resolve: async (_parent, args, { db, user, tabId }) =>
      retry(async () => {
        const [column] = await db((tx) =>
          tx
            .update(columns)
            .set({
              title: args.title ?? undefined,
              rank: args.rank ?? undefined,
              updatedBy: exists(tabId, "Missing tabID"),
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
