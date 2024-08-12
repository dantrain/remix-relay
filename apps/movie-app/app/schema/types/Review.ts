import { builder } from "../builder";

export const Review = builder.drizzleNode("reviews", {
  name: "Review",
  id: { column: (review) => review.id },
  fields: (t) => ({
    quote: t.exposeString("quote"),
    fresh: t.exposeBoolean("fresh"),
    criticName: t.exposeString("criticName"),
    criticSource: t.exposeString("criticSource"),
  }),
});
