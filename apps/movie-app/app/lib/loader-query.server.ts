import { getLoaderQuery } from "@remix-relay/server";
import { defer, json } from "@remix-run/node";
import { schema } from "~/graphql/graphql-schema";

export const loaderQuery = getLoaderQuery(schema, json, defer);
