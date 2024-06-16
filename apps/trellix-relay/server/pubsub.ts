/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
import { omit } from "lodash-es";
import { EventEmitter } from "node:events";
import invariant from "tiny-invariant";
import type { Database } from "./__generated__/database.types";
import { env } from "./env";

type Registration = {
  table: keyof Database["public"]["Tables"];
  eventType: "INSERT" | "UPDATE" | "DELETE";
  id?: string;
  userId: string;
  tabId?: string;
};

const globalSupabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);

export class PubSub {
  private ee: EventEmitter;
  private channels: { [key: string]: RealtimeChannel };
  private subscriptions: {
    [key: string]: [{ [key: string]: any }, (...args: any[]) => void];
  };
  private subIdCounter: number;

  constructor() {
    this.ee = new EventEmitter();
    this.channels = {};
    this.subscriptions = {};
    this.subIdCounter = 0;
  }

  async publish(): Promise<void> {
    console.error("Not implemented");
    return Promise.resolve();
  }

  async subscribe(
    { table, eventType, userId, id, tabId }: Registration,
    onMessage: (...args: any[]) => void,
  ): Promise<number> {
    this.channels[table] ??= globalSupabase
      .channel(table)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          const row =
            payload.eventType === "DELETE" ? payload.old : payload.new;

          this.ee.emit(
            JSON.stringify({
              table,
              eventType: payload.eventType,
              userId: row.id.split(":")[0],
              id: payload.eventType === "UPDATE" ? row.id : null,
            }),
            row,
          );
        },
      )
      .subscribe((status, err) => {
        console.log({ table, status });

        if (err) {
          console.error(err);
        }
      });

    const trigger = { table, eventType, userId, id: id ?? null };

    const listener = (row: { [key: string]: any }) => {
      if (row?.updatedBy !== tabId) {
        onMessage(omit(row, ["createdAt", "updatedBy"]));
      }
    };

    this.ee.addListener(JSON.stringify(trigger), listener);
    this.subIdCounter = this.subIdCounter + 1;
    this.subscriptions[this.subIdCounter] = [trigger, listener];

    return Promise.resolve(this.subIdCounter);
  }

  async unsubscribe(subId: number) {
    const subscription = this.subscriptions[subId];
    invariant(subscription);
    const [trigger, listener] = subscription;
    delete this.subscriptions[subId];

    if (
      !Object.values(this.subscriptions).find(
        ([{ table }]) => table === trigger.table,
      )
    ) {
      this.channels[trigger.table]?.unsubscribe();
      delete this.channels[trigger.table];
    }

    this.ee.removeListener(JSON.stringify(trigger), listener);
  }

  public asyncIterableIterator<T>(
    registration: Registration,
  ): AsyncIterableIterator<T> {
    return new PubSubAsyncIterator<T>(this, registration);
  }
}

export class PubSubAsyncIterator<T> implements AsyncIterator<T> {
  private pullQueue: ((value: IteratorResult<T>) => void)[];
  private pushQueue: T[];
  private registration: Registration;
  private subscriptionIdPromise: Promise<number> | null;
  private running: boolean;
  private pubsub: PubSub;

  constructor(pubsub: PubSub, registration: Registration) {
    this.pubsub = pubsub;
    this.pullQueue = [];
    this.pushQueue = [];
    this.running = true;
    this.subscriptionIdPromise = null;
    this.registration = registration;
  }

  public async next(): Promise<IteratorResult<T>> {
    if (!this.subscriptionIdPromise) {
      await (this.subscriptionIdPromise = this.pubsub.subscribe(
        this.registration,
        this.pushValue.bind(this),
      ));
    }
    return this.pullValue();
  }

  public async return(): Promise<IteratorResult<T>> {
    await this.emptyQueue();
    return { value: undefined, done: true };
  }

  public async throw(error: any) {
    await this.emptyQueue();
    return Promise.reject(error);
  }

  public [Symbol.asyncIterator]() {
    return this;
  }

  private async pushValue(event: T) {
    await this.subscriptionIdPromise;
    if (this.pullQueue.length !== 0) {
      this.pullQueue.shift()?.(
        this.running
          ? { value: event, done: false }
          : { value: undefined, done: true },
      );
    } else {
      this.pushQueue.push(event);
    }
  }

  private pullValue(): Promise<IteratorResult<T>> {
    return new Promise((resolve) => {
      if (this.pushQueue.length !== 0) {
        resolve(
          this.running
            ? { value: this.pushQueue.shift() as T, done: false }
            : { value: undefined, done: true },
        );
      } else {
        this.pullQueue.push(resolve);
      }
    });
  }

  private async emptyQueue() {
    if (this.running) {
      this.running = false;
      this.pullQueue.forEach((resolve) =>
        resolve({ value: undefined, done: true }),
      );
      this.pullQueue.length = 0;
      this.pushQueue.length = 0;
      const subscriptionId = await this.subscriptionIdPromise;
      if (subscriptionId) {
        this.pubsub.unsubscribe(subscriptionId);
      }
    }
  }
}
