/* eslint-disable react-hooks/rules-of-hooks */
import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { createYoga } from "graphql-yoga";
import { schema } from "~/graphql/graphql-schema";
import { useDeferStream } from "@graphql-yoga/plugin-defer-stream";

export const yoga = createYoga({ schema, plugins: [useDeferStream()] });

export const executor: ReturnType<typeof buildHTTPExecutor> = buildHTTPExecutor(
  {
    fetch: yoga.fetch,
  },
);
