/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";
import { PubSubEngine } from "graphql-subscriptions";
import { $$asyncIterator } from "iterall";
import { omit } from "lodash-es";
import invariant from "tiny-invariant";
import { supabase } from "./supabase-client";

export class PubSub implements PubSubEngine {
  protected ee: EventEmitter;
  private subscriptions: { [key: string]: [string, (...args: any[]) => void] };
  private subIdCounter: number;

  constructor() {
    this.ee = new EventEmitter();
    this.subscriptions = {};
    this.subIdCounter = 0;

    supabase
      .channel("counters")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "counters" },
        (payload) => {
          console.log("payload", payload);

          if (payload.eventType === "INSERT") {
            this.ee.emit("counterCreated", omit(payload.new, ["createdAt"]));
          } else if (payload.eventType === "DELETE") {
            this.ee.emit("counterDeleted", payload.old);
          }
        },
      )
      .subscribe();
  }

  async publish(triggerName: string, payload: any): Promise<void> {
    console.log("publish", { triggerName, payload });

    this.ee.emit(triggerName, payload);
    return Promise.resolve();
  }

  async subscribe(
    triggerName: string,
    onMessage: (...args: any[]) => void,
  ): Promise<number> {
    console.log("subscribe", { triggerName, onMessage });

    this.ee.addListener(triggerName, onMessage);
    this.subIdCounter = this.subIdCounter + 1;
    this.subscriptions[this.subIdCounter] = [triggerName, onMessage];

    return Promise.resolve(this.subIdCounter);
  }

  async unsubscribe(subId: number) {
    console.log("unsubscribe", { subId });

    const subsciptions = this.subscriptions[subId];
    invariant(subsciptions);
    const [triggerName, onMessage] = subsciptions;
    delete this.subscriptions[subId];
    this.ee.removeListener(triggerName, onMessage);
  }

  asyncIterator<T>(
    triggers: string | string[],
  ): AsyncIterator<T, any, undefined> {
    console.log("get asyncIterator", { triggers });

    return new PubSubAsyncIterator<T>(this, triggers);
  }
}

class PubSubAsyncIterator<T> implements AsyncIterator<T> {
  private pullQueue: ((value: IteratorResult<T>) => void)[];
  private pushQueue: T[];
  private eventsArray: string[];
  private allSubscribed: Promise<number[]> | null;
  private running: boolean;
  private pubsub: PubSubEngine;

  constructor(pubsub: PubSubEngine, eventNames: string | string[]) {
    this.pubsub = pubsub;
    this.pullQueue = [];
    this.pushQueue = [];
    this.running = true;
    this.allSubscribed = null;
    this.eventsArray =
      typeof eventNames === "string" ? [eventNames] : eventNames;
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

  public [$$asyncIterator]() {
    return this;
  }

  private async pushValue(event: T) {
    console.log("pushValue", event);

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
    console.log("pullValue");

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
    return Promise.all(
      this.eventsArray.map((eventName) =>
        this.pubsub.subscribe(eventName, this.pushValue.bind(this), {}),
      ),
    );
  }

  private unsubscribeAll(subscriptionIds: number[]) {
    for (const subscriptionId of subscriptionIds) {
      this.pubsub.unsubscribe(subscriptionId);
    }
  }
}
