import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import SmartSubscriptionsPlugin, {
  subscribeOptionsFromIterator,
} from "@pothos/plugin-smart-subscriptions";
import ValidationPlugin from "@pothos/plugin-validation";
import { ApolloContext } from "server";
import type { Objects } from "./types";

const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: ApolloContext;
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin, SmartSubscriptionsPlugin, ValidationPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    edgesFieldOptions: { nullable: false },
  },
  smartSubscriptions: {
    ...subscribeOptionsFromIterator((name, { pubsub }) =>
      pubsub.asyncIterableIterator(name),
    ),
  },
});

builder.queryType({});
builder.subscriptionType({});
builder.mutationType({});

export { builder };
