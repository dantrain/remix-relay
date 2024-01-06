import { clientLoaderQuery as remixRelayClientLoaderQuery } from "@remix-relay/react";
import { OperationType } from "relay-runtime";
import { getCurrentEnvironment } from "./relay-environment";

type Tail<T extends unknown[]> = T extends [unknown, ...infer TailType]
  ? TailType
  : never;

export async function clientLoaderQuery<TQuery extends OperationType>(
  ...args: Tail<Parameters<typeof remixRelayClientLoaderQuery>>
) {
  return remixRelayClientLoaderQuery<TQuery>(getCurrentEnvironment(), ...args);
}
