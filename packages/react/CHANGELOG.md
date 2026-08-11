# @remix-relay/react

## 5.0.0

### Major Changes

- [`f3538f3`](https://github.com/dantrain/remix-relay/commit/f3538f3eb4e881f07b2acd43675b8d2dcf449ca6) Thanks [@dantrain](https://github.com/dantrain)! - Support React Router 8

  ### Breaking changes
  - **React Router 8 required** - The `react-router` peer dependency moves from `^7.0.0` to `^8.0.0`.
  - **`metaQuery` receives `loaderData` instead of `data`** - React Router 8 removed the deprecated `data` field from `MetaArgs`.
  - **ESM only** - The CommonJS build has been dropped to match React Router 8, which is published as ESM only.
  - **Raised baseline** - Following React Router 8, the `react` and `react-dom` peer dependencies move from `>=18` to `>=19.2.7`, and `engines.node` is now `>=22.22.0`.

  ### Migration

  Rename `data` to `loaderData` in every `metaQuery` callback:

  ```diff
  - export const meta = metaQuery<itemQuery>(({ data }) => [
  -   { title: `${data.item} | My App` },
  + export const meta = metaQuery<itemQuery>(({ loaderData }) => [
  +   { title: `${loaderData.item} | My App` },
    ]);
  ```

  Then follow the [React Router 8 upgrade guide](https://reactrouter.com/upgrading/v8) for the framework's own breaking changes. The one most likely to affect a remix-relay app is that `future.v8_middleware` is now the default, so `loader`, `action` and `middleware` receive a `RouterContextProvider` rather than a plain `AppLoadContext`. A `loaderQuery` wrapper like the one in the getting-started guide becomes:

  ```diff
  + import { createContext } from "react-router";
  +
  + export const pothosContext = createContext<Partial<PothosContext>>();

    export const loaderQuery = <TQuery extends OperationType>(
  -   { pothosContext }: AppLoadContext,
  +   context: Readonly<RouterContextProvider>,
      ...rest: LoaderQueryArgs<TQuery>
    ) => {
  -   return getLoaderQuery(schema, pothosContext)<TQuery>(...rest);
  +   return getLoaderQuery(schema, context.get(pothosContext))<TQuery>(...rest);
    };
  ```

  > [!NOTE]
  > Context keys created with `createContext()` are matched by identity. If you use a custom server (as in the getting-started guide), the server and the React Router build are loaded through separate module graphs, so a module creating context keys is instantiated twice and `context.get()` will throw `No value found for context`. Create the keys once and share that single instance across both graphs.

## 4.2.0

## 4.1.0

### Minor Changes

- [#8](https://github.com/dantrain/remix-relay/pull/8) [`9f32aec`](https://github.com/dantrain/remix-relay/commit/9f32aec6f6fbe73bacc1a1b661654121e3ff954a) Thanks [@dantrain](https://github.com/dantrain)! - Upgrade `graphql` peer dependency from `17.0.0-alpha.9` to `17.0.0-alpha.14`.

  This follows the incremental delivery rewrite in graphql-js alpha.10, which added back-pressure sensitivity to `@defer`/`@stream` execution.

  **Apollo Server compatibility:** Apollo Server (up to v5.5.0) has a hardcoded version check for `graphql@17.0.0-alpha.9` and will not use `experimentalExecuteIncrementally` with alpha.14, causing schemas with `@defer`/`@stream` directives to throw. A patch is required -- see the `patches/@apollo__server@5.5.0.patch` in the repo for reference.

## 4.0.0

### Major Changes

- [#6](https://github.com/dantrain/remix-relay/pull/6) [`2749601`](https://github.com/dantrain/remix-relay/commit/27496015f5c5f2796b18259da1ababd349bee6b3) Thanks [@dantrain](https://github.com/dantrain)! - Stream `@defer` chunks incrementally via linked-promise chain

  ### Breaking changes
  - **`RemixRelayProvider` removed** - The `RemixRelayProvider` component is no longer exported from `@remix-relay/react`. Relay's native `@defer` Observable pattern now handles per-fragment streaming directly.
  - **`deferredQueries` replaced with `deferredChunk`** - The server loader return type changes from `deferredQueries: Promise<chunk[]>` to `deferredChunk: Promise<DeferredChunkNode | null>`. Each deferred fragment now resolves independently as its data arrives, rather than waiting for all fragments to complete.

  ### Migration

  Remove `RemixRelayProvider` from your root layout:

  ```diff
  - import { RemixRelayProvider } from "@remix-relay/react";

    export default function App() {
      return (
  -     <RemixRelayProvider>
  -       <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
  -         <Suspense>
  -           <Outlet />
  -         </Suspense>
  -       </RelayEnvironmentProvider>
  -     </RemixRelayProvider>
  +     <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
  +       <Suspense>
  +         <Outlet />
  +       </Suspense>
  +     </RelayEnvironmentProvider>
      );
    }
  ```

  No other changes are needed. The `useLoaderQuery`, `Deferred`, and `loaderQuery` APIs remain the same.

## 3.0.0

### Major Changes

- [#3](https://github.com/dantrain/remix-relay/pull/3) [`d2fb8cd`](https://github.com/dantrain/remix-relay/commit/d2fb8cdedcee9e5f7c015f930c54b6a2b269fc5a) Thanks [@dantrain](https://github.com/dantrain)! - Update to GraphQL incremental delivery format (incrementalSpec v0.2)

  ### Breaking changes
  - **`graphql` peer dependency updated from `17.0.0-alpha.2` to `17.0.0-alpha.9`** - Adopts the newer incremental delivery response format with `pending`/`incremental`/`completed` fields.
  - **Client fetch function must use `processMultipartResponse`** - The client-side relay environment fetch function must be updated to use the new `processMultipartResponse` utility exported from `@remix-relay/react`, which handles the new response format. The `Accept` header must also change from `deferSpec=20220824` to `incrementalSpec=v0.2`.

  ### Migration

  Update the `graphql` dependency:

  ```shell
  pnpm add graphql@17.0.0-alpha.9
  ```

  Update the client relay environment fetch function to use `processMultipartResponse`:

  ```typescript
  import {
    getCachedResponse,
    processMultipartResponse,
  } from "@remix-relay/react";
  
  const fetchFn: FetchFunction = (params, variables, cacheConfig) => {
    return (
      getCachedResponse(params, variables, cacheConfig) ??
      Observable.create((sink) => {
        (async () => {
          try {
            const response = await fetch("/graphql", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "multipart/mixed; incrementalSpec=v0.2, application/json",
              },
              body: JSON.stringify({ query: params.text, variables }),
            });
  
            const parts = await meros(response);
  
            for await (const payload of processMultipartResponse(parts)) {
              sink.next(payload);
            }
          } finally {
            sink.complete();
          }
        })();
      })
    );
  };
  ```
