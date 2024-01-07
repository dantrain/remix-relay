import { getClientLoaderQuery } from "@remix-relay/react";
import { getCurrentEnvironment } from "./relay-environment";

export const clientLoaderQuery = getClientLoaderQuery(getCurrentEnvironment());
