import { resolveArrayConnection } from "@pothos/plugin-relay";
import { desc, eq, relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import { pick } from "lodash-es";
import { builder } from "../builder";
import { Board, boards } from "./Board";
import { columns } from "./Column";
import { items } from "./Item";

export const users = authUsers;

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
  columns: many(columns),
  items: many(items),
}));

export type User = Pick<typeof users.$inferSelect, "id">;

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
      return pick(user, "id");
    },
  }),
);
