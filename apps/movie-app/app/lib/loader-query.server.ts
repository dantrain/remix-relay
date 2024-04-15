import { defer, json } from "@remix-run/node";
import { getLoaderQuery } from "@remix-relay/server";
import { schema } from "~/graphql/graphql-schema";

export const loaderQuery = getLoaderQuery(schema, json, defer);
