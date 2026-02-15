# @remix-relay/react

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
