import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { builder } from "../builder";
import { drizzle } from "drizzle-orm/d1";

export const tests = sqliteTable("test", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
});

export type Test = typeof tests.$inferSelect;

export const Test = builder.node("Test", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    title: t.exposeString("title"),
  }),
});

builder.queryField("test", (t) =>
  t.field({
    type: Test,
    nullable: true,
    resolve: async (_parent, _args, ctx) => {
      const db = drizzle(ctx.DB);
      const [result] = await db.select().from(tests).all();
      return result;
    },
  }),
);
