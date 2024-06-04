import { pgSchema, uuid } from "drizzle-orm/pg-core";
import { pick } from "lodash-es";
import invariant from "tiny-invariant";
import { builder } from "../builder";

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export type User = typeof users.$inferSelect;

export const User = builder.node("User", {
  id: { resolve: (_) => _.id },
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
