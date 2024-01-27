import { decodeGlobalID } from "@pothos/plugin-relay";
import { Database } from "server/__generated__/database.types";
import invariant from "tiny-invariant";
import { z } from "zod";
import { builder } from "../builder";

export type Counter = Omit<
  Database["public"]["Tables"]["counters"]["Row"],
  "createdAt" | "userId"
>;

export const Counter = builder.node("Counter", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    count: t.exposeInt("count"),
  }),
});

builder.queryField("counter", (t) =>
  t.field({
    type: Counter,
    args: {
      id: t.arg.id({ required: true }),
    },
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

      const counter = await getCounter(id);
      invariant(counter, "Counter not found");

      return counter;
    },
  }),
);

builder.subscriptionFields((t) => ({
  counter: t.field({
    type: Counter,
    args: {
      id: t.arg.id({ required: true }),
    },
    subscribe: (_parent, args, { pubsub, user, supabase }) => {
      invariant(user);

      return pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "UPDATE",
        id: decodeGlobalID(args.id.toString()).id,
        userId: user.id,
        supabase,
      });
    },
    resolve: (counter) => counter,
  }),
  counterCreated: t.field({
    type: Counter,
    subscribe: (_parent, _args, { pubsub, user, supabase }) => {
      invariant(user);

      return pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "INSERT",
        userId: user.id,
        supabase,
      });
    },
    resolve: (counter) => counter,
  }),
  counterDeleted: t.field({
    type: Counter,
    subscribe: (_parent, _args, { pubsub, user, supabase }) => {
      invariant(user);

      return pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "DELETE",
        userId: user.id,
        supabase,
      });
    },
    resolve: (counter) => counter,
  }),
}));

builder.mutationFields((t) => ({
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
}));
