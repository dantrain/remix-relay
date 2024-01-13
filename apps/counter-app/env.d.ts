/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    apolloServer: ApolloServer<BaseContext>;
  }
}
