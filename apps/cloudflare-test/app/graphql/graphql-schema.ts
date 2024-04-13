import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello, world!",
    }),
    slow: t.string({
      resolve: async () => {
        // await new Promise((res) => void setTimeout(res, 1000));
        return "Slow ride, take it easy";
      },
    }),
  }),
});

export const schema = builder.toSchema();
