/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { omit } from "lodash-es";
import invariant from "tiny-invariant";
import type { Database } from "./__generated__/database.types";

type Registration = {
  table: keyof Database["public"]["Tables"];
  eventType: "INSERT" | "UPDATE" | "DELETE";
  id?: string;
  userId: string;
  supabase: SupabaseClient<Database>;
};

export class PubSub {
  private subscriptions: { [key: string]: RealtimeChannel };
  private subIdCounter: number;

  constructor() {
    this.subscriptions = {};
    this.subIdCounter = 0;
  }

  async publish(): Promise<void> {
    console.error("Not implemented");
    return Promise.resolve();
  }

  async subscribe(
    registration: Registration,
    onMessage: (...args: any[]) => void,
  ): Promise<number> {
    this.subIdCounter = this.subIdCounter + 1;

    const channel = registration.supabase
      .channel(this.subIdCounter.toString())
      .on(
        "postgres_changes",
        {
          event: registration.eventType as any,
          schema: "public",
          table: registration.table,
          filter: registration.id ? `id=eq.${registration.id}` : undefined,
        },
        (payload) => {
          const row =
            payload.eventType === "DELETE" ? payload.old : payload.new;

          const userId = row.id.split(":")[0];

          if (userId !== registration.userId) {
            return;
          }

          onMessage(omit(row, ["createdAt"]));
        },
      )
      .subscribe();

    this.subscriptions[this.subIdCounter] = channel;

    return Promise.resolve(this.subIdCounter);
  }

  async unsubscribe(subId: number) {
    const channel = this.subscriptions[subId];
    invariant(channel);
    channel.unsubscribe();
    delete this.subscriptions[subId];
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
