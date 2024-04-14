import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import { Objects } from "./types";

const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: Env;
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    edgesFieldOptions: { nullable: false },
  },
});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello, world!",
    }),
  }),
});

export { builder };
