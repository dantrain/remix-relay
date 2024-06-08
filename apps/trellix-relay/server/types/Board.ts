import { resolveArrayConnection } from "@pothos/plugin-relay";
import { and, asc, eq, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import pRetry from "p-retry";
import exists from "server/lib/exists";
import { fromGlobalId } from "server/lib/global-id";
import { z } from "zod";
import { builder } from "../builder";
import { Column, columns } from "./Column";
import { users } from "./User";

export const boards = pgTable("boards", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const boardRelations = relations(boards, ({ one, many }) => ({
  user: one(users, { fields: [boards.userId], references: [users.id] }),
  columns: many(columns),
}));

export type Board = typeof boards.$inferSelect;

export const Board = builder.node("Board", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    name: t.exposeString("name"),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
    columnConnection: t.connection({
      type: Column,
      resolve: async ({ id }, args, { db }) => {
        const data = await db((tx) =>
          tx
            .select()
            .from(columns)
            .where(eq(columns.boardId, id))
            .orderBy(asc(columns.createdAt)),
        );

        return resolveArrayConnection({ args }, data);
      },
    }),
  }),
});

builder.queryField("board", (t) =>
  t.field({
    type: Board,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: z.string().cuid2() },
      }),
    },
    resolve: async (_parent, args, { db, user }) => {
      return pRetry(
        async () => {
          const [board] = await db((tx) =>
            tx
              .select()
              .from(boards)
              .where(
                and(
                  eq(boards.userId, user.id),
                  eq(boards.id, args.id.toString()),
                ),
              ),
          );

          return exists(board, "Board not found");
        },
        { retries: 3 },
      );
    },
  }),
);

builder.mutationFields((t) => ({
  createOneBoard: t.field({
    type: Board,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: z.string().cuid2() },
      }),
      name: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(50) },
      }),
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
      name: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(50) },
      }),
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
