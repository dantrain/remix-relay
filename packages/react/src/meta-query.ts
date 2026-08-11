import type { MetaFunction } from "react-router";
import type { OperationType } from "relay-runtime";

export function metaQuery<TQuery extends OperationType>(
  metaFunction: (
    args: Parameters<MetaFunction>[0] & {
      loaderData: TQuery["response"];
    },
  ) => ReturnType<MetaFunction>,
): MetaFunction<
  () =>
    | { preloadedQuery: { response: { data: TQuery["response"] } } }
    | { data: TQuery["response"] }
> {
  return ({ loaderData, ...rest }) => {
    const metaData: TQuery["response"] =
      loaderData && "data" in loaderData
        ? loaderData.data
        : loaderData && "preloadedQuery" in loaderData
          ? (
              loaderData.preloadedQuery.response as {
                data: TQuery["response"];
              }
            ).data
          : null;

    return metaFunction({
      loaderData: metaData,
      ...rest,
    });
  };
}
