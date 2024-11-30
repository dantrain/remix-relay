import { PothosContext } from "server";
import { Env } from "server/env";

declare module "react-router" {
  interface AppLoadContext {
    env: Env;
    pothosContext: Partial<PothosContext>;
  }
}
