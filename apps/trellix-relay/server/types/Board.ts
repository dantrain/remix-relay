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
import { z } from "zod";
import { builder } from "../builder";
import { Column, columns } from "./Column";
import { users } from "./User";

export const boards = pgTable(
  "boards",
  {
    id: varchar().primaryKey(),
    title: text().notNull(),
    userId: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (board) => [index("board_user_idx").on(board.userId)],
);

export const boardRelations = relations(boards, ({ one, many }) => ({
  user: one(users, { fields: [boards.userId], references: [users.id] }),
  columns: many(columns),
}));

export type Board = typeof boards.$inferSelect;

export const Board = builder.node("Board", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    title: t.exposeString("title", { nullable: false }),
    createdAt: t.string({
      resolve: ({ createdAt }) => createdAt.toISOString(),
    }),
    columnConnection: t.connection({
      type: Column,
      nullable: false,
      resolve: async ({ id }, args, { db }) => {
        const data = await db((tx) =>
          tx.query.columns.findMany({
            where: eq(columns.boardId, id),
            orderBy: asc(columns.rank),
          }),
        );

        return resolveArrayConnection({ args }, data);
      },
    }),
  }),
});

builder.queryField("board", (t) =>
  t.field({
    type: Board,
    nullable: false,
    args: {
      id: t.arg.id({
        required: true,
        validate: { schema: z.string().cuid2() },
      }),
    },
    resolve: async (_parent, args, { db, user }) =>
      retry(async () => {
        const board = await db((tx) =>
          tx.query.boards.findFirst({
            where: and(
              eq(boards.userId, user.id),
              eq(boards.id, args.id.toString()),
            ),
          }),
        );

        return exists(board, "Board not found");
      }),
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
      title: t.arg.string({
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
            title: args.title,
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
      title: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(50) },
      }),
    },
    resolve: async (_parent, args, { db, user }) =>
      retry(async () => {
        const [board] = await db((tx) =>
          tx
            .update(boards)
            .set({ title: args.title })
            .where(
              and(
                eq(boards.id, fromGlobalId(args.id)),
                eq(boards.userId, user.id),
              ),
            )
            .returning(),
        );

        return exists(board, "Board not found");
      }),
  }),
  deleteOneBoard: t.field({
    type: Board,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, { db, user }) =>
      retry(async () => {
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
      }),
  }),
}));
