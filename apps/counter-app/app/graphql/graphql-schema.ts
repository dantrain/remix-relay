import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";

const builder = new SchemaBuilder<{
  Objects: {
    Counter: {
      count: number;
    };
  };
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    edgesFieldOptions: { nullable: false },
  },
});

let count = 0;

const Counter = builder.node("Counter", {
  id: { resolve: () => "id" },
  fields: (t) => ({
    count: t.exposeInt("count"),
  }),
});

builder.queryType({
  fields: (t) => ({
    counter: t.field({
      type: Counter,
      resolve: () => ({ count }),
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    setCount: t.field({
      type: Counter,
      args: {
        count: t.arg.int({ required: true }),
      },
      resolve: (_parent, args) => {
        count = Math.max(0, args.count);
        return { count };
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
