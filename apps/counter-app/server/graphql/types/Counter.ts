import { decodeGlobalID } from "@pothos/plugin-relay";
import { Database } from "server/__generated__/database.types";
import invariant from "tiny-invariant";
import { z } from "zod";
import { builder } from "../builder";

const fromGlobalId = (id: string | number) => decodeGlobalID(id.toString()).id;

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
      const getCounter = async (id: string) => {
        const { data } = await supabase
          .from("counters")
          .select("id, count")
          .eq("id", id);

        invariant(data);
        return data[0];
      };

      const counter = await getCounter(fromGlobalId(args.id));
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
    subscribe: (_parent, { id }, { pubsub, user, supabase }) => {
      invariant(user);

      return pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "UPDATE",
        id: fromGlobalId(id),
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
    resolve: async (_parent, { id, count }, { supabase }) => {
      const { data } = await supabase
        .from("counters")
        .update({ count })
        .eq("id", fromGlobalId(id))
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
        validate: {
          schema: z.string().refine((value) => {
            const parts = value.split(":");
            return (
              parts.length === 2 &&
              z.string().uuid().parse(parts[0]) &&
              z.string().cuid2().parse(parts[1])
            );
          }),
        },
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
      const id = fromGlobalId(args.id);

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
