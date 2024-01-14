import SchemaBuilder from "@pothos/core";
import RelayPlugin, {
  decodeGlobalID,
  resolveArrayConnection,
} from "@pothos/plugin-relay";
import SmartSubscriptionsPlugin, {
  subscribeOptionsFromIterator,
} from "@pothos/plugin-smart-subscriptions";
import ValidationPlugin from "@pothos/plugin-validation";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";
import type { PubSub } from "graphql-subscriptions";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";

const wait = (ms?: number) => {
  if (ms) return new Promise((resolve) => setTimeout(resolve, ms));
};

type Counter = {
  id: string;
  count: number;
};

const builder = new SchemaBuilder<{
  Objects: {
    Counter: Counter;
  };
  Context: { pubsub: PubSub };
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
      pubsub.asyncIterator(name),
    ),
  },
});

let data = [
  {
    id: uuidv4(),
    count: 0,
  },
  {
    id: uuidv4(),
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
    counterConnection: t.connection({
      type: Counter,
      resolve: (_parent, args) => resolveArrayConnection({ args }, data),
    }),
    counter: t.field({
      type: Counter,
      args: {
        id: t.arg.id({ required: true }),
      },
      smartSubscription: true,
      subscribe: (subscriptions) => void subscriptions.register("countSet"),
      resolve: async (_parent, args) => {
        const id = decodeGlobalID(args.id.toString()).id;

        let counter = data.find((_) => _.id === id);

        if (!counter) {
          await wait(500);
          counter = data.find((_) => _.id === id);
        }

        invariant(counter, "Counter not found");

        return counter;
      },
    }),
  }),
});

builder.subscriptionType({
  fields: (t) => ({
    counterCreated: t.field({
      type: Counter,
      subscribe: (_parent, _args, { pubsub }) =>
        pubsub.asyncIterator(
          "counterCreated",
        ) as unknown as AsyncIterable<Counter>,
      resolve: (counter) => counter,
    }),
    counterDeleted: t.field({
      type: Counter,
      subscribe: (_parent, _args, { pubsub }) =>
        pubsub.asyncIterator(
          "counterDeleted",
        ) as unknown as AsyncIterable<Counter>,
      resolve: (counter) => counter,
    }),
  }),
});

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
    createOneCounter: t.field({
      type: Counter,
      args: { id: t.arg.id({ required: true, validate: { uuid: true } }) },
      resolve: (_parent, args, { pubsub }) => {
        const counter = { id: args.id.toString(), count: 0 };
        data.push(counter);
        pubsub.publish("counterCreated", counter);
        return counter;
      },
    }),
    deleteOneCounter: t.field({
      type: Counter,
      args: { id: t.arg.id({ required: true }) },
      resolve: (_parent, args, { pubsub }) => {
        const id = decodeGlobalID(args.id.toString()).id;

        const counter = data.find((_) => _.id === id);
        invariant(counter, "Counter not found");

        data = data.filter((_) => _.id !== id);

        pubsub.publish("counterDeleted", counter);
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
