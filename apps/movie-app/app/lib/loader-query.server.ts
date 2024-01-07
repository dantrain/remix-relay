import { getLoaderQuery } from "@remix-relay/node";
import { server } from "./apollo-server";

export const loaderQuery = getLoaderQuery(server);
