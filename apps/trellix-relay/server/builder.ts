import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import ZodPlugin from "@pothos/plugin-zod";
import { PothosContext } from "server";
import type { Objects } from "./types";

SchemaBuilder.allowPluginReRegistration = true;

const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: PothosContext;
  DefaultEdgesNullability: false;
  DefaultNodeNullability: false;
}>({
  plugins: [RelayPlugin, ZodPlugin],
  relay: {
    edgesFieldOptions: { nullable: false },
    nodeFieldOptions: { nullable: false },
  },
});

builder.queryType({});
builder.subscriptionType({});
builder.mutationType({});

export { builder };
