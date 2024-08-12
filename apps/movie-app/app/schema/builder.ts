import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import RelayPlugin from "@pothos/plugin-relay";
import { DrizzleD1Database } from "drizzle-orm/d1";
import * as dbSchema from "./db-schema";
import type { User } from "./db-schema";

export type PothosContext = {
  db: DrizzleD1Database<typeof dbSchema>;
  user: User | null;
};

const builder = new SchemaBuilder<{
  DrizzleSchema: typeof dbSchema;
  Context: PothosContext;
  DefaultEdgesNullability: false;
  DefaultNodeNullability: false;
  DefaultFieldNullability: false;
}>({
  defaultFieldNullability: false,
  plugins: [RelayPlugin, DrizzlePlugin],
  relay: {
    edgesFieldOptions: { nullable: false },
    nodeFieldOptions: { nullable: false },
  },
  drizzle: {
    client: ({ db }) => db,
    schema: dbSchema,
  },
});

builder.queryType({});
builder.mutationType({});

export { builder };
