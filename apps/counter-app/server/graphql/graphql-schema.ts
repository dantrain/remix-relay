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
import { pick } from "lodash-es";
import { ApolloContext } from "server";
import { Database } from "server/__generated__/database.types";
import invariant from "tiny-invariant";
import z from "zod";

const wait = (ms?: number) => {
  if (ms) return new Promise((resolve) => setTimeout(resolve, ms));
};

type User = {
  id: string;
};

type Counter = Omit<
  Database["public"]["Tables"]["counters"]["Row"],
  "createdAt"
>;

const builder = new SchemaBuilder<{
  Objects: {
    User: User;
    Counter: Counter;
  };
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
      pubsub.asyncIterator(name),
    ),
  },
});

const User = builder.node("User", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    counterConnection: t.connection({
      type: Counter,
      resolve: async ({ id }, args, { supabase }) => {
        const { data } = await supabase
          .from("counters")
          .select("id, count")
          .eq("userId", id)
          .order("createdAt");

        invariant(data);
        return resolveArrayConnection({ args }, data);
      },
    }),
  }),
});

const Counter = builder.node("Counter", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    count: t.exposeInt("count"),
  }),
});

builder.queryType({
  fields: (t) => ({
    viewer: t.field({
      type: User,
      resolve: (_parent, _args, { user }) => {
        invariant(user);
        return pick(user, "id");
      },
    }),
    counter: t.field({
      type: Counter,
      args: {
        id: t.arg.id({ required: true }),
      },
      smartSubscription: true,
      subscribe: (subscriptions, _parent, args) =>
        void subscriptions.register(
          JSON.stringify({
            table: "counters",
            eventType: "UPDATE",
            id: decodeGlobalID(args.id.toString()).id,
          }),
        ),
      resolve: async (_parent, args, { supabase }) => {
        const id = decodeGlobalID(args.id.toString()).id;

        const getCounter = async (id: string) => {
          const { data } = await supabase
            .from("counters")
            .select("id, count")
            .eq("id", id);

          invariant(data);
          return data[0];
        };

        let counter = await getCounter(id);

        if (!counter) {
          await wait(500);
          counter = await getCounter(id);
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
      subscribe: (_parent, _args, { pubsub, user }) => {
        invariant(user);

        return pubsub.asyncIterator(
          JSON.stringify({
            table: "counters",
            eventType: "INSERT",
            userId: user.id,
          }),
        ) as unknown as AsyncIterable<Counter>;
      },
      resolve: (counter) => counter,
    }),
    counterDeleted: t.field({
      type: Counter,
      subscribe: (_parent, _args, { pubsub }) =>
        pubsub.asyncIterator(
          JSON.stringify({
            table: "counters",
            eventType: "DELETE",
          }),
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
      resolve: async (_parent, args, { supabase }) => {
        const id = decodeGlobalID(args.id.toString()).id;
        const count = args.count;

        const { data } = await supabase
          .from("counters")
          .update({ count })
          .eq("id", id)
          .select("id, count");

        invariant(data);
        const counter = data[0];
        invariant(counter, "Counter not found");

        counter.count = count;
        return counter;
      },
    }),
    createOneCounter: t.field({
      type: Counter,
      args: {
        id: t.arg.id({
          required: true,
          validate: { schema: z.string().cuid2() },
        }),
      },
      resolve: async (_parent, args, { supabase }) => {
        const counter = { id: args.id.toString(), count: 0 };

        const { status } = await supabase.from("counters").insert(counter);
        invariant(status === 201);

        return counter;
      },
    }),
    deleteOneCounter: t.field({
      type: Counter,
      args: { id: t.arg.id({ required: true }) },
      resolve: async (_parent, args, { supabase }) => {
        const id = decodeGlobalID(args.id.toString()).id;

        const { data } = await supabase
          .from("counters")
          .select("id, count")
          .eq("id", id);

        invariant(data);
        const counter = data[0];
        invariant(counter, "Counter not found");

        await supabase.from("counters").delete().eq("id", id);

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
