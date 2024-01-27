/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RealtimeChannel,
  SupabaseClient,
  createClient,
} from "@supabase/supabase-js";
import { omit } from "lodash-es";
import invariant from "tiny-invariant";
import { Database } from "./__generated__/database.types";
import { env } from "./env";

const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);
export class PubSub {
  // protected ee: EventEmitter;
  private subscriptions: { [key: string]: RealtimeChannel };
  private subIdCounter: number;

  constructor() {
    // this.ee = new EventEmitter();
    this.subscriptions = {};
    this.subIdCounter = 0;

    // const channel = supabase
    //   .channel("counters")
    //   .on(
    //     "postgres_changes",
    //     { event: "*", schema: "public", table: "counters" },
    //     (payload) => {
    //       if (payload.eventType === "INSERT") {
    //         this.ee.emit(
    //           JSON.stringify({
    //             table: "counters",
    //             eventType: "INSERT",
    //             userId: payload.new.userId,
    //           }),
    //           omit(payload.new, ["createdAt"]),
    //         );
    //       } else if (payload.eventType === "DELETE") {
    //         this.ee.emit(
    //           JSON.stringify({
    //             table: "counters",
    //             eventType: "DELETE",
    //           }),
    //           payload.old,
    //         );
    //       } else if (payload.eventType === "UPDATE") {
    //         this.ee.emit(
    //           JSON.stringify({
    //             table: "counters",
    //             eventType: "UPDATE",
    //             id: payload.new.id,
    //           }),
    //           omit(payload.new, ["createdAt"]),
    //         );
    //       }
    //     },
    //   )
    //   .subscribe();
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

    console.log("registration", omit(registration, ["supabase"]));

    const channel = (registration.supabase as SupabaseClient<Database>)
      .channel(this.subIdCounter.toString())
      .on(
        "postgres_changes",
        {
          event: registration.eventType,
          schema: "public",
          table: registration.table,
          filter: `userId=eq.${registration.userId}`,
        },
        (payload) => {
          console.log("payload", payload);

          switch (payload.eventType) {
            case "INSERT":
            case "UPDATE":
              return onMessage(omit(payload.new, ["createdAt"]));
            case "DELETE":
              return onMessage(payload.old);
            default:
              throw new Error("Unknown eventType");
          }
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
