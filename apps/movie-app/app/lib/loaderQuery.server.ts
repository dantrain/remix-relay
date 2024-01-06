import { loaderQuery as remixRelayLoaderQuery } from "@remix-relay/remix-relay";
import { OperationType } from "relay-runtime";
import { getServer } from "./apollo-server";

type Tail<T extends unknown[]> = T extends [unknown, ...infer TailType]
  ? TailType
  : never;

export async function loaderQuery<TQuery extends OperationType>(
  ...args: Tail<Parameters<typeof remixRelayLoaderQuery>>
) {
  return remixRelayLoaderQuery<TQuery>(await getServer(), ...args);
}
