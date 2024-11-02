import { decodeGlobalID } from "@pothos/plugin-relay";
import { Database } from "server/__generated__/database.types";
import invariant from "tiny-invariant";
import { z } from "zod";
import { builder } from "../builder";

const fromGlobalId = (id: string) => decodeGlobalID(id).id;

export type Counter = Omit<
  Database["public"]["Tables"]["counters"]["Row"],
  "createdAt" | "userId" | "updatedBy"
>;

export const Counter = builder.node("Counter", {
  id: { resolve: (_) => _.id },
  fields: (t) => ({
    count: t.exposeInt("count", { nullable: false }),
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

        invariant(data, "Missing data");
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
    subscribe: (_parent, { id }, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "UPDATE",
        id: fromGlobalId(id),
        userId: user.id,
        tabId,
      }),
    resolve: (counter) => counter,
  }),
  counterCreated: t.field({
    type: Counter,
    subscribe: (_parent, _args, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "INSERT",
        userId: user.id,
        tabId,
      }),
    resolve: (counter) => counter,
  }),
  counterDeleted: t.field({
    type: Counter,
    subscribe: (_parent, _args, { pubsub, user, tabId }) =>
      pubsub.asyncIterableIterator<Counter>({
        table: "counters",
        eventType: "DELETE",
        userId: user.id,
        tabId,
      }),
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
    resolve: async (_parent, { id, count }, { supabase, tabId }) => {
      const { data } = await supabase
        .from("counters")
        .update({ count, updatedBy: tabId })
        .eq("id", fromGlobalId(id))
        .select("id, count");

      invariant(data, "Missing data");
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
        validate: (value) => {
          const parts = value.toString().split(":");
          return !!(
            parts.length === 2 &&
            z.string().uuid().parse(parts[0]) &&
            z.string().cuid2().parse(parts[1])
          );
        },
      }),
    },
    resolve: async (_parent, args, { supabase, tabId }) => {
      const counter = { id: args.id.toString(), count: 0, updatedBy: tabId };

      const { status } = await supabase.from("counters").insert(counter);
      invariant(status === 201, "Failed to create counter");

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

      invariant(data, "Missing data");
      const counter = data[0];
      invariant(counter, "Counter not found");

      await supabase.from("counters").delete().eq("id", id);

      return counter;
    },
  }),
}));
