import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import { Objects } from "./types";
import { DrizzleD1Database } from "drizzle-orm/d1";
import * as dbSchema from "./db-schema";

export type PothosContext = {
  db: DrizzleD1Database<typeof dbSchema>;
};

const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: PothosContext;
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
