import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { createYoga } from "graphql-yoga";
import { schema } from "~/graphql/graphql-schema";

export const yoga = createYoga({ schema });

export const executor: ReturnType<typeof buildHTTPExecutor> = buildHTTPExecutor(
  {
    fetch: yoga.fetch,
  },
);
