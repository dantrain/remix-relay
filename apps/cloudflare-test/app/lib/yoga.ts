import { createYoga } from "graphql-yoga";
import { schema } from "~/graphql/graphql-schema";

export const yoga = createYoga({ schema });
