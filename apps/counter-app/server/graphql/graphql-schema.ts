import SchemaBuilder from "@pothos/core";
import RelayPlugin, { decodeGlobalID } from "@pothos/plugin-relay";
import SmartSubscriptionsPlugin, {
  subscribeOptionsFromIterator,
} from "@pothos/plugin-smart-subscriptions";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";
import type { PubSub } from "graphql-subscriptions";
import invariant from "tiny-invariant";

const builder = new SchemaBuilder<{
  Objects: {
    Counter: {
      id: string;
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

const data = [
  {
    id: "1",
    count: 0,
  },
  {
    id: "2",
    count: 0,
  },
];

const Counter = builder.node("Counter", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    count: t.exposeInt("count"),
  }),
});

builder.queryType({
  fields: (t) => ({
    counters: t.field({
      type: [Counter],
      resolve: () => data,
    }),
    counter: t.field({
      type: Counter,
      args: {
        id: t.arg.id({ required: true }),
      },
      smartSubscription: true,
      subscribe: (subscriptions) => subscriptions.register("countSet"),
      resolve: (_parent, args) => {
        const id = decodeGlobalID(args.id.toString()).id;

        const counter = data.find((_) => _.id === id);
        invariant(counter, "Counter not found");

        return counter;
      },
    }),
  }),
});

builder.subscriptionType();

builder.mutationType({
  fields: (t) => ({
    setCount: t.field({
      type: Counter,
      args: {
        id: t.arg.id({ required: true }),
        count: t.arg.int({ required: true }),
      },
      resolve: (_parent, args, { pubsub }) => {
        const id = decodeGlobalID(args.id.toString()).id;
        const count = args.count;

        const counter = data.find((_) => _.id === id);
        invariant(counter, "Counter not found");

        counter.count = count;
        pubsub.publish("countSet", { id, count });
        return counter;
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
