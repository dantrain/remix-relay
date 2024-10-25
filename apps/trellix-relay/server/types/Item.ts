import { and, eq, relations } from "drizzle-orm";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { retry } from "lib/retry";
import { idSchema } from "lib/zod-schemas";
import { builder } from "server/builder";
import invariant from "tiny-invariant";
import { z } from "zod";
import { columns } from "./Column";
import { users } from "./User";

export const items = pgTable(
  "items",
  {
    id: varchar().primaryKey(),
    title: varchar().notNull(),
    rank: varchar().notNull(),
    userId: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    columnId: varchar()
      .references(() => columns.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedBy: varchar().notNull(),
  },
  (item) => ({
    columnIdx: index("item_column_idx").on(item.columnId),
    rankIdx: index("item_rank_idx").on(item.rank),
  }),
);

export const itemRelations = relations(items, ({ one }) => ({
  user: one(users, { fields: [items.userId], references: [users.id] }),
  column: one(columns, { fields: [items.columnId], references: [columns.id] }),
}));

export type Item = typeof items.$inferSelect;

export const Item = builder.node("Item", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    title: t.exposeString("title", { nullable: false }),
    rank: t.exposeString("rank", { nullable: false }),
    columnId: t.exposeString("columnId"),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
  }),
});

builder.subscriptionFields((t) => ({
  item: t.field({
    type: Item,
    nullable: false,
    args: {
      id: t.arg.id({ required: true }),
    },
    subscribe: (_parent, { id }, { pubsub, user, tabId }) => {
      return pubsub.asyncIterableIterator<Item>({
        table: "items",
        eventType: "UPDATE",
        id: fromGlobalId(id),
        userId: user.id,
        tabId,
      });
    },
    resolve: (column) => column,
  }),
  itemCreated: t.field({
    type: Item,
    nullable: false,
    subscribe: (_parent, _args, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Item>({
        table: "items",
        eventType: "INSERT",
        userId: user.id,
        tabId,
      }),
    resolve: (column) => column,
  }),
  itemDeleted: t.field({
    type: Item,
    nullable: false,
    subscribe: (_parent, _args, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Item>({
        table: "items",
        eventType: "DELETE",
        userId: user.id,
        tabId,
      }),
    resolve: (column) => column,
  }),
}));

builder.mutationFields((t) => ({
  createOneItem: t.field({
    type: Item,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: idSchema },
      }),
      title: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(100) },
      }),
      rank: t.arg.string({ required: true }),
      columnId: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user, tabId }) => {
      const [item] = await db(async (tx) => {
        const column = await tx.query.columns.findFirst({
          where: eq(columns.id, fromGlobalId(args.columnId)),
          columns: { userId: true },
        });

        invariant(column?.userId === user.id, "Unauthorized");

        return tx
          .insert(items)
          .values({
            id: args.id.toString(),
            title: args.title,
            rank: args.rank,
            userId: user.id,
            columnId: fromGlobalId(args.columnId),
            updatedBy: exists(tabId, "Missing tabID"),
          })
          .returning();
      });

      return exists(item, "Item not found");
    },
  }),
  updateOneItem: t.field({
    type: Item,
    args: {
      id: t.arg.id({ required: true }),
      rank: t.arg.string(),
      columnId: t.arg.id(),
      title: t.arg.string(),
    },
    resolve: async (_parent, args, { db, user, tabId }) =>
      retry(async () => {
        const [item] = await db((tx) =>
          tx
            .update(items)
            .set({
              rank: args.rank ?? undefined,
              columnId: args.columnId ? fromGlobalId(args.columnId) : undefined,
              title: args.title ?? undefined,
              updatedBy: exists(tabId, "Missing tabID"),
            })
            .where(
              and(
                eq(items.id, fromGlobalId(args.id)),
                eq(items.userId, user.id),
              ),
            )
            .returning(),
        );

        return exists(item, "Item not found");
      }),
  }),
  deleteOneItem: t.field({
    type: Item,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) =>
      retry(async () => {
        const [item] = await db((tx) =>
          tx
            .delete(items)
            .where(
              and(
                eq(items.id, fromGlobalId(args.id)),
                eq(items.userId, user.id),
              ),
            )
            .returning(),
        );

        return exists(item, "Item not found");
      }),
  }),
}));
