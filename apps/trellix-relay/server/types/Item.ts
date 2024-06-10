import { and, eq, relations } from "drizzle-orm";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import exists from "lib/exists";
import { fromGlobalId } from "lib/global-id";
import { builder } from "server/builder";
import invariant from "tiny-invariant";
import { z } from "zod";
import { columns } from "./Column";
import { users } from "./User";

export const items = pgTable(
  "items",
  {
    id: varchar("id").primaryKey(),
    text: varchar("text").notNull(),
    rank: varchar("rank").notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    columnId: varchar("column_id")
      .references(() => columns.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
    text: t.exposeString("text"),
    rank: t.exposeString("rank"),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
  }),
});

builder.mutationFields((t) => ({
  createOneItem: t.field({
    type: Item,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: z.string().cuid2() },
      }),
      text: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(100) },
      }),
      rank: t.arg.string({ required: true }),
      columnId: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
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
            text: args.text,
            rank: args.rank,
            userId: user.id,
            columnId: fromGlobalId(args.columnId),
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
      rank: t.arg.string({ required: true }),
      columnId: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [item] = await db((tx) =>
        tx
          .update(items)
          .set({
            rank: args.rank,
            columnId: fromGlobalId(args.columnId),
          })
          .where(
            and(eq(items.id, fromGlobalId(args.id)), eq(items.userId, user.id)),
          )
          .returning(),
      );

      return exists(item, "Item not found");
    },
  }),
  deleteOneItem: t.field({
    type: Item,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) => {
      const [item] = await db((tx) =>
        tx
          .delete(items)
          .where(
            and(eq(items.id, fromGlobalId(args.id)), eq(items.userId, user.id)),
          )
          .returning(),
      );

      return exists(item, "Item not found");
    },
  }),
}));
