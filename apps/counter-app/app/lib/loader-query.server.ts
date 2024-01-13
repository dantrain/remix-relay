import { getLoaderQuery } from "@remix-relay/server";
import { server } from "./apollo-server";

export const loaderQuery = getLoaderQuery(server);
