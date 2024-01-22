/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";
import { PubSubEngine } from "graphql-subscriptions";
import { omit } from "lodash-es";
import invariant from "tiny-invariant";
import { supabase } from "./supabase-client";

export class PubSub extends PubSubEngine {
  protected ee: EventEmitter;
  private subscriptions: { [key: string]: [string, (...args: any[]) => void] };
  private subIdCounter: number;

  constructor() {
    super();

    this.ee = new EventEmitter();
    this.subscriptions = {};
    this.subIdCounter = 0;

    supabase
      .channel("counters")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "counters" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            this.ee.emit(
              JSON.stringify({
                table: "counters",
                eventType: "INSERT",
                userId: payload.new.userId,
              }),
              omit(payload.new, ["createdAt"]),
            );
          } else if (payload.eventType === "DELETE") {
            this.ee.emit(
              JSON.stringify({
                table: "counters",
                eventType: "DELETE",
              }),
              payload.old,
            );
          } else if (payload.eventType === "UPDATE") {
            this.ee.emit(
              JSON.stringify({
                table: "counters",
                eventType: "UPDATE",
                id: payload.new.id,
              }),
              omit(payload.new, ["createdAt"]),
            );
          }
        },
      )
      .subscribe();
  }

  async publish(): Promise<void> {
    console.error("Not implemented");
    return Promise.resolve();
  }

  async subscribe(
    triggerName: string,
    onMessage: (...args: any[]) => void,
  ): Promise<number> {
    this.ee.addListener(triggerName, onMessage);
    this.subIdCounter = this.subIdCounter + 1;
    this.subscriptions[this.subIdCounter] = [triggerName, onMessage];

    return Promise.resolve(this.subIdCounter);
  }

  async unsubscribe(subId: number) {
    const subsciptions = this.subscriptions[subId];
    invariant(subsciptions);
    const [triggerName, onMessage] = subsciptions;
    delete this.subscriptions[subId];
    this.ee.removeListener(triggerName, onMessage);
  }
}
