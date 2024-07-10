import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import { DrizzleD1Database } from "drizzle-orm/d1";
import * as dbSchema from "./db-schema";
import { Objects } from "./types";
import { User } from "./types/User";

export type PothosContext = {
  db: DrizzleD1Database<typeof dbSchema>;
  user: User | null;
};

const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: PothosContext;
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin],
  relay: {
    edgesFieldOptions: { nullable: false },
  },
});

builder.queryType({});
builder.mutationType({});

export { builder };
