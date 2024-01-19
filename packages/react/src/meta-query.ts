/* eslint-disable no-unused-vars */
import type { ServerRuntimeMetaFunction } from "@remix-run/server-runtime";
import type { OperationType } from "relay-runtime";

export function metaQuery<TQuery extends OperationType>(
  metaFunction: (
    args: Parameters<ServerRuntimeMetaFunction>[0] & {
      data: TQuery["response"];
    },
  ) => ReturnType<ServerRuntimeMetaFunction>,
): ServerRuntimeMetaFunction<
  () =>
    | { preloadedQuery: { response: { data: TQuery["response"] } } }
    | { data: TQuery["response"] }
> {
  return ({ data, ...rest }) => {
    const metaData: TQuery["response"] =
      data && "data" in data
        ? data.data
        : data && "preloadedQuery" in data
          ? (data.preloadedQuery.response as { data: TQuery["response"] }).data
          : null;

    return metaFunction({
      data: metaData,
      ...rest,
    });
  };
}
