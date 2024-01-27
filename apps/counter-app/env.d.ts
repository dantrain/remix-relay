/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    env: import("./server/env").Env;
    apolloServer: ApolloServer<BaseContext>;
    apolloContext: Partial<import("./server/index").ApolloContext>;
  }
}

declare namespace Express {
  export interface Request {
    context: import("./server/index").RequestContext;
  }
}
