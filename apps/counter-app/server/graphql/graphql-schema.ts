import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import SmartSubscriptionsPlugin, {
  subscribeOptionsFromIterator,
} from "@pothos/plugin-smart-subscriptions";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";
import type { PubSub } from "graphql-subscriptions";

const builder = new SchemaBuilder<{
  Objects: {
    Counter: {
      count: number;
    };
  };
  Context: { pubsub: PubSub };
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin, SmartSubscriptionsPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    edgesFieldOptions: { nullable: false },
  },
  smartSubscriptions: {
    ...subscribeOptionsFromIterator((name, { pubsub }) =>
      pubsub.asyncIterator(name),
    ),
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
      smartSubscription: true,
      subscribe: (subscriptions) => subscriptions.register("countSet"),
      resolve: () => ({ count }),
    }),
  }),
});

builder.subscriptionType();

builder.mutationType({
  fields: (t) => ({
    setCount: t.field({
      type: Counter,
      args: {
        count: t.arg.int({ required: true }),
      },
      resolve: (_parent, args, { pubsub }) => {
        count = args.count;
        pubsub.publish("countSet", { count });
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
