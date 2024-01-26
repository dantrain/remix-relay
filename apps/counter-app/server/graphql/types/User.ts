import { resolveArrayConnection } from "@pothos/plugin-relay";
import { pick } from "lodash-es";
import invariant from "tiny-invariant";
import { builder } from "../builder";
import { Counter } from "./Counter";

export type User = {
  id: string;
};

export const User = builder.node("User", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    counterConnection: t.connection({
      type: Counter,
      resolve: async ({ id }, args, { supabase }) => {
        const { data } = await supabase
          .from("counters")
          .select("id, count")
          .eq("userId", id)
          .order("createdAt");

        invariant(data);
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
