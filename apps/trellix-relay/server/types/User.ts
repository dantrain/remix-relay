import { resolveArrayConnection } from "@pothos/plugin-relay";
import { eq, relations } from "drizzle-orm";
import { pgSchema, uuid } from "drizzle-orm/pg-core";
import { pick } from "lodash-es";
import invariant from "tiny-invariant";
import { builder } from "../builder";
import { Board, boards } from "./Board";

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
}));

export type User = typeof users.$inferSelect;

export const User = builder.node("User", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    boardConnection: t.connection({
      type: Board,
      resolve: async ({ id }, args, { db }) => {
        const data = await db((tx) =>
          tx.select().from(boards).where(eq(boards.userId, id)),
        );

        return resolveArrayConnection({ args }, data);
      },
    }),
  }),
});

builder.queryField("viewer", (t) =>
  t.field({
    type: User,
    resolve: (_parent, _args, { user }) => {
      invariant(user);
      return pick(user, "id");
    },
  }),
);
