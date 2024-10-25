import "@remix-run/node";
import { PothosContext } from "server";
import { Env } from "server/env";

declare module "@remix-run/node" {
  interface AppLoadContext {
    env: Env;
    pothosContext: Partial<PothosContext>;
  }

  interface Future {
    v3_singleFetch: true;
  }
}
