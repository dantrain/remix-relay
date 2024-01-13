import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";

const builder = new SchemaBuilder<{
  // Objects: Objects;
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    edgesFieldOptions: { nullable: false },
  },
});

const count = 0;

builder.queryType({
  fields: (t) => ({
    count: t.int({
      resolve: () => count,
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
