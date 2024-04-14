import SchemaBuilder from "@pothos/core";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";

const builder = new SchemaBuilder<{ Context: Env }>({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello, world!",
    }),
    slow: t.string({
      resolve: async (_parent, _args, ctx) => {
        // await new Promise((res) => void setTimeout(res, 1000));
        const result = await ctx.DB.prepare("SELECT * FROM test").first();
        return result?.title as string;
      },
    }),
  }),
});

export const schema = builder.toSchema({
  directives: [
    ...specifiedDirectives,
    GraphQLDeferDirective,
    GraphQLStreamDirective,
  ],
});
