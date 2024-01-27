/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { omit } from "lodash-es";
import invariant from "tiny-invariant";
import type { Database } from "./__generated__/database.types";

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
    registration: any,
    onMessage: (...args: any[]) => void,
  ): Promise<number> {
    this.subIdCounter = this.subIdCounter + 1;

    const channel = (registration.supabase as SupabaseClient<Database>)
      .channel(this.subIdCounter.toString())
      .on(
        "postgres_changes",
        {
          event: registration.eventType,
          schema: "public",
          table: registration.table,
          filter: registration.id
            ? `id=eq.${registration.id}`
            : `userId=eq.${registration.userId}`,
        },
        (payload) => {
          onMessage(
            omit(payload.eventType === "DELETE" ? payload.old : payload.new, [
              "createdAt",
            ]),
          );
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

  public asyncIterableIterator<T>(registration: any): AsyncIterableIterator<T> {
    return new PubSubAsyncIterator<T>(this, registration);
  }
}

export class PubSubAsyncIterator<T> implements AsyncIterator<T> {
  private pullQueue: ((value: IteratorResult<T>) => void)[];
  private pushQueue: T[];
  private registration: any;
  private allSubscribed: Promise<number> | null;
  private running: boolean;
  private pubsub: PubSub;

  constructor(pubsub: PubSub, registration: any) {
    this.pubsub = pubsub;
    this.pullQueue = [];
    this.pushQueue = [];
    this.running = true;
    this.allSubscribed = null;
    this.registration = registration;
  }

  public async next(): Promise<IteratorResult<T>> {
    if (!this.allSubscribed) {
      await (this.allSubscribed = this.subscribeAll());
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
    await this.allSubscribed;
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
      const subscriptionIds = await this.allSubscribed;
      if (subscriptionIds) {
        this.unsubscribeAll(subscriptionIds);
      }
    }
  }

  private subscribeAll() {
    return this.pubsub.subscribe(this.registration, this.pushValue.bind(this));
  }

  private unsubscribeAll(subscriptionId: number) {
    this.pubsub.unsubscribe(subscriptionId);
  }
}
