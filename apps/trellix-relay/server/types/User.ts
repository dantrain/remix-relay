import { pick } from "lodash-es";
import invariant from "tiny-invariant";
import { builder } from "../builder";

export type User = {
  id: string;
};

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
