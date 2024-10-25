import { resolveArrayConnection } from "@pothos/plugin-relay";
import { desc, eq, relations } from "drizzle-orm";
import { pgSchema, uuid } from "drizzle-orm/pg-core";
import { pick } from "lodash-es";
import invariant from "tiny-invariant";
import { builder } from "../builder";
import { Board, boards } from "./Board";
import { columns } from "./Column";
import { items } from "./Item";

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid().primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
  columns: many(columns),
  items: many(items),
}));

export type User = typeof users.$inferSelect;

export const User = builder.node("User", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    boardConnection: t.connection({
      type: Board,
      nullable: false,
      resolve: async ({ id }, args, { db }) => {
        const data = await db((tx) =>
          tx.query.boards.findMany({
            where: eq(boards.userId, id),
            orderBy: desc(boards.createdAt),
          }),
        );

        return resolveArrayConnection({ args }, data);
      },
    }),
  }),
});

builder.queryField("viewer", (t) =>
  t.field({
    type: User,
    nullable: false,
    resolve: (_parent, _args, { user }) => {
      invariant(user);
      return pick(user, "id");
    },
  }),
);
