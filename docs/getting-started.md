# Getting started

Follow this guide to build a basic web app with remix-relay and learn how it works. You will:

 - Server side render a Home page with fast-loading data from a GraphQL API.
 - Stream in slow-loading data with `@defer`.
 - Server side render an Item page, using a route parameter as a query variable.
 - Use the Relay cache for client navigations.

### React Router app

We'll start by creating a new React Router application with the `node-custom-server` template, as per the [React Router docs](https://reactrouter.com/start/framework/installation).

```shell
pnpm create react-router@latest --template remix-run/react-router-templates/node-custom-server
```

> [!NOTE]
> remix-relay can also be used with other runtimes such as Cloudflare or Vercel.

### GraphQL schema

For this guide we'll use [Pothos](https://pothos-graphql.dev/) to create the GraphQL schema.

```shell
pnpm add @pothos/core @pothos/plugin-relay graphql@17.0.0-alpha.2
```

Add a `server/graphql-schema.ts` file.

```typescript
import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import { GraphQLDeferDirective } from "graphql";
import { setTimeout } from "node:timers/promises";

const builder = new SchemaBuilder({
  plugins: [RelayPlugin],
  relay: {},
});

builder.queryType({
  fields: (t) => ({
    fast: t.string({
      resolve: () => "Alright mate?",
    }),
    slow: t.string({
      resolve: async () => {
        await setTimeout(1000);
        return "Hello geezer, I'm pleased to see you!";
      },
    })
  }),
});

export const schema = builder.toSchema({
  directives: [GraphQLDeferDirective],
});
```

Note the inclusion of `GraphQLDeferDirective` in the schema. The Relay compiler will need this to recognise the `@defer` directive.

### GraphQL endpoint

For this guide we'll use [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server).

```shell
pnpm add graphql-yoga
```

> [!NOTE]
> [Apollo Server]() also works well.

Add a GraphQL endpoint in `server/app.ts`.

```diff
+import { createYoga } from "graphql-yoga";
+import { schema } from "./graphql-schema";

// ...

export const app = express();

+const yoga = createYoga({ schema });
+
+app.use(yoga.graphqlEndpoint, yoga);
```

Run the dev server with `pnpm run dev` and navigate to `http://localhost/graphql` to open the playground.

Try a query for the fast-loading data:

```graphql
{
  fast
}
```

And a query for both the fast-loading and slow-loading data:

```graphql
{
  fast
  ...SlowFragment @defer
}

fragment SlowFragment on Query {
  slow
}
```

### Write GraphQL schema file

The Relay Compiler requires a `.graphql` SDL schema file as input. We'll need a script to generate it.

Add a `scripts/write-graphql-schema.ts` file.

```typescript
import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "../server/graphql-schema";

const schemaAsString = printSchema(lexicographicSortSchema(schema));

writeFileSync("schema.graphql", schemaAsString);

console.log("Done!");
process.exit(0);
```

A good way to run this is with [tsx](https://tsx.is/).

```shell
pnpm add -D tsx
```

Add a script to `package.json`:

```diff
+"write-graphql-schema": "tsx ./scripts/write-graphql-schema.ts",
```

Run the script with `pnpm run write-graphql-schema`. You should see the `schema.graphql` file appear in the root directory.

### Install Relay and remix-relay

```shell
pnpm add @remix-relay/react @remix-relay/server react-relay relay-runtime meros

pnpm add -D relay-compiler @types/react-relay @types/relay-runtime vite-plugin-relay vite-plugin-cjs-interop
```

Add a `relay.config.json` file.

```json
{
  "src": "./app",
  "schema": "schema.graphql",
  "language": "typescript",
  "eagerEsModules": true,
  "excludes": ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"]
}
```

Update `vite.config.ts`.

```diff
+import { cjsInterop } from "vite-plugin-cjs-interop";
+import relay from "vite-plugin-relay";

// ...

  plugins: [
+   cjsInterop({ dependencies: ["react-relay"] }),
+   relay,
    reactRouter(),
    tsconfigPaths(),
  ]
```

`vite-plugin-cjs-interop` allows importing named exports from Relay despite it being a CommonJS module.

### Relay environment

Relay uses an `Environment` to manage GraphQL data. During SSR we will load data from remix-relay, on the client we will fetch data from the `/graphql` endpoint.

Add a `app/lib/relay-environment.ts` file.

```typescript
import { getCachedResponse } from "@remix-relay/react";
import { meros } from "meros/browser";
import type {
  CacheConfig,
  FetchFunction,
  RequestParameters,
  Variables,
} from "relay-runtime";
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";

const isServer = typeof document === "undefined";

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig
) => {
  return (
    getCachedResponse(params, variables, cacheConfig) ??
    Observable.create((sink) => {
      const fetchGraphQL = async () => {
        try {
          const response = await fetch("/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "multipart/mixed; deferSpec=20220824, application/json",
            },
            body: JSON.stringify({
              query: params.text,
              variables,
            }),
          });

          const parts = await meros(response);

          if (parts instanceof Response) {
            sink.next(await parts.json());
          } else {
            for await (const part of parts) {
              sink.next({
                ...part.body,
                ...part.body?.incremental?.[0],
              });
            }
          }
        } catch (err) {
          if (!isServer) {
            console.error(
              err instanceof Error ? err.message : "Something went wrong"
            );
          }

          throw err;
        } finally {
          sink.complete();
        }
      };

      setTimeout(() => fetchGraphQL(), 0);
    })
  );
};

const createEnvironment = () =>
  new Environment({
    network: Network.create(fetchFn),
    store: new Store(RecordSource.create()),
    isServer,
  });

let environment: Environment;

export function getCurrentEnvironment() {
  if (isServer) {
    return createEnvironment();
  }

  return (environment ??= createEnvironment());
}
```

Note the use of `fetch()` to request data, and the [meros](https://github.com/maraisr/meros) library to read the multipart response. This enables streaming of client requests.

Add providers and Suspense boundary to `app/root.tsx`.

```diff
+import { RemixRelayProvider } from "@remix-relay/react";
+import { Suspense } from "react";
+import { RelayEnvironmentProvider } from "react-relay";
+import { getCurrentEnvironment } from "./lib/relay-environment";

// ...

export default function App() {
  return (
+   <RemixRelayProvider>
+     <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
+       <Suspense>
          <Outlet />
+       </Suspense>
+     </RelayEnvironmentProvider>
+   </RemixRelayProvider>
  );
}
```

### Home page query

Add a query to `app/routes/home.tsx`.

```diff
+import { graphql } from "react-relay";
+
+const query = graphql`
+  query homeQuery {
+    fast
+  }
+`;
```

Note that the query name is prefixed by the filename "home", this is a Relay convention.

Now we need to run the Relay compiler to generate TypeScript types for the query. Add a script to `package.json`:

```diff
+"relay": "relay-compiler",
```

Run the script with `pnpm run relay`. You should see an `app/routes/__generated__/homeQuery.graphql.ts` file appear.

> [!TIP]
> If you don't want to commit these generated files, add `__generated__/` to the `.gitignore` file to ignore these folders.
