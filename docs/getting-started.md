# Getting started

Follow this guide to build a basic web app with remix-relay and learn how it works. You will:

- Server side render a Home page with fast-loading data from a GraphQL API.
- Stream in slow-loading data with `@defer`.
- Server side render an Item page, using a route parameter as a query variable.
- Use the Relay cache for client navigations.

## Prerequisites

This guide uses [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/). You could also use npm, yarn etc.

## React Router app

We'll start by creating a new React Router application with the `node-custom-server` template, as per the [React Router docs](https://reactrouter.com/start/framework/installation).

```shell
pnpm create react-router@latest --template remix-run/react-router-templates/node-custom-server
```

> [!NOTE]
> remix-relay can also be used with other runtimes such as Cloudflare or Vercel.

## GraphQL schema

For this guide we'll use [Pothos](https://pothos-graphql.dev/) to create the GraphQL schema.

```shell
pnpm add @pothos/core graphql@17.0.0-alpha.2
```

> [!NOTE]
> This pre-release version of the [graphql](https://github.com/graphql/graphql-js) package includes support for the `@defer` directive.

Add a `server/graphql-schema.ts` file.

```typescript
import SchemaBuilder from "@pothos/core";
import { GraphQLDeferDirective } from "graphql";
import { setTimeout } from "node:timers/promises";

const builder = new SchemaBuilder({});

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
    }),
  }),
});

export const schema = builder.toSchema({
  directives: [GraphQLDeferDirective],
});
```

Note the inclusion of `GraphQLDeferDirective` in the schema. The Relay compiler will need this to recognise the `@defer` directive.

## GraphQL endpoint

For this guide we'll use [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server).

```shell
pnpm add graphql-yoga
```

> [!NOTE] > [Apollo Server]() also works well.

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

Run the dev server with `pnpm run dev` and navigate to [http://localhost:3000/graphql](http://localhost:3000/graphql) to open the playground.

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

## Write GraphQL schema file

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

## Install Relay and remix-relay

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

## Relay environment

Relay uses an `Environment` to manage GraphQL data. During SSR we will load data from remix-relay, on the client we will fetch data from the `/graphql` endpoint.

Add an `app/lib/relay-environment.ts` file.

```typescript
import { meros } from "meros/browser";
import {
  type CacheConfig,
  type FetchFunction,
  type RequestParameters,
  type Variables,
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";
import { getCachedResponse } from "@remix-relay/react";

const fetchFn: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
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
        } finally {
          sink.complete();
        }
      };

      fetchGraphQL();
    })
  );
};

const createEnvironment = () =>
  new Environment({
    network: Network.create(fetchFn),
    store: new Store(RecordSource.create()),
  });

let environment: Environment;

export function getCurrentEnvironment() {
  if (typeof document === "undefined") {
    return createEnvironment();
  }

  return (environment ??= createEnvironment());
}
```

Note the use of `fetch` to request data, and the [meros](https://github.com/maraisr/meros) library to read the multipart response. This enables streaming of client requests.

Add providers and a Suspense boundary to `app/root.tsx`.

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

## Loaders set up

Add an `app/lib/loader-query.server.ts` file.

```typescript
import type { LoaderFunctionArgs } from "react-router";
import type { OperationType } from "relay-runtime";
import { schema } from "server/graphql-schema";
import { type LoaderQueryArgs, getLoaderQuery } from "@remix-relay/server";

export const loaderQuery = <TQuery extends OperationType>(
  _args: LoaderFunctionArgs,
  ...rest: LoaderQueryArgs<TQuery>
) => {
  return getLoaderQuery(schema)<TQuery>(...rest);
};
```

This is where you can check the request e.g. for auth, pass data from the loader context into the GraphQL resolver context etc.

Note the `.server` in the filename, this [explicitly marks the module as server-only](https://reactrouter.com/explanation/special-files#server-modules).

Add an `app/lib/client-loader-query.ts` file.

```typescript
import { getClientLoaderQuery } from "@remix-relay/react";
import { getCurrentEnvironment } from "./relay-environment";

export const clientLoaderQuery = getClientLoaderQuery(getCurrentEnvironment());
```

This returns a [client loader](https://reactrouter.com/start/framework/data-loading#client-data-loading) for client navigations using the Relay cache.

## Home page query

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

## Home page loaders

Add the remix-relay loader and client loader to `app/routes/home.tsx`, and access the data with the `useLoaderQuery` hook.

```diff
+import { useLoaderQuery } from "@remix-relay/react";
+import { loaderQuery } from "~/lib/loader-query.server";
+import { clientLoaderQuery } from "~/lib/client-loader-query";
+import type { homeQuery } from "./__generated__/homeQuery.graphql";

// ...

-export function loader({ context }: Route.LoaderArgs) {
-  return { message: context.VALUE_FROM_EXPRESS };
-}
+export const loader = (args: Route.LoaderArgs) => loaderQuery<homeQuery>(args, query, {});
+
+export const clientLoader = () => clientLoaderQuery<homeQuery>(query, {});

-export default function Home({ loaderData }: Route.ComponentProps) {
-  return <Welcome message={loaderData.message} />;
-}
+export default function Home() {
+  const [data] = useLoaderQuery<homeQuery>(query);
+
+  return <p>{data.fast}</p>;
+}
```

Note that the generated `homeQuery` type is imported and passed to `useLoaderQuery` as a generic parameter. This ensures that `data` is fully typed.

Run the dev server with `pnpm run dev` and navigate to [http://localhost:3000](http://localhost:3000) to open the home page and see the query data displayed.

## Streaming

Let's make a component to display the slow-loading data. Add an `app/components/Slow.tsx` file.

```typescript
import { graphql, useFragment } from "react-relay";
import type { SlowFragment$key } from "./__generated__/SlowFragment.graphql";

const fragment = graphql`
  fragment SlowFragment on Query {
    slow
  }
`;

export default function Slow({ queryRef }: { queryRef: SlowFragment$key }) {
  const data = useFragment(fragment, queryRef);

  return <p>{data.slow}</p>;
}
```

Run the Relay compiler again with `pnpm run relay` to generate the types for the fragment.

Back in `app/routes/home.tsx`, add the fragment to the query with the `@defer` directive and render the new component.

```diff
-import { useLoaderQuery } from "@remix-relay/react";
+import { Deferred, useLoaderQuery } from "@remix-relay/react";
+import Slow from "~/components/Slow";

const query = graphql`
  query homeQuery {
    fast
+   ...SlowFragment @defer
  }
`;

// ...

export default function Home() {
  const [data] = useLoaderQuery<homeQuery>(query);

- return <p>{data.fast}</p>;
+ return (
+   <>
+     <p>{data.fast}</p>
+     <Deferred fallback={<p>...</p>}>
+       <Slow queryRef={data} />
+     </Deferred>
+   </>
+ );
}
```

The `Deferred` component acts as a Suspense boundary and works with the `RemixRelayProvider` to enable streaming.

Run the Relay compiler once more with `pnpm run relay` to regenerate the types.

Run the dev server again and observe that the slow-loading data streams in after the fast-loading data is displayed. Use the browser dev tools network panel to confirm that all the data is streamed in through the initial document request, and no Fetch/XHR requests are made.

## Watch for file changes

It's tedious having to manually run the `write-graphql-schema` and `relay` scripts when the GraphQL schema or queries are updated. Here's a method to run them in parallel with the `dev` script using [concurrently](https://github.com/open-cli-tools/concurrently) and [Watchman](https://facebook.github.io/watchman/).

```shell
pnpm add -D concurrently
```

> [!IMPORTANT]
> Follow the [official documentation](https://facebook.github.io/watchman/docs/install) to install Watchman.

Update the `dev` script in `package.json`:

```diff
-"dev": "cross-env NODE_ENV=development node server.js",
+"dev": "concurrently --kill-others \"cross-env NODE_ENV=development node server.js\" \"relay-compiler --watch\" \"watchman-make -p 'server/graphql-schema.ts' --run 'pnpm run write-graphql-schema'\""
```

This will run the Relay compiler in watch mode and will also watch the `server/graphql-schema.ts` file and run the script to update `schema.graphql`. If you go on to build a schema across multiple files, update the Watchman glob pattern accordingly.

## Item page

Let's create a route that uses a route parameter as a GraphQL query variable.

First, add a field with an input argument to the schema in `server/graphql-schema.ts`.

```diff
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
    }),
+   item: t.string({
+     args: {
+       id: t.arg.string({ required: true }),
+     },
+     resolve: (_parent, { id }) => `Item #${id}`,
+   }),
  }),
});
```

Next add an `app/routes/item.tsx` file.

```typescript
import { graphql } from "react-relay";
import { metaQuery, useLoaderQuery } from "@remix-relay/react";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import type { Route } from "./+types/item";
import type { itemQuery } from "./__generated__/itemQuery.graphql";

const query = graphql`
  query itemQuery($id: String!) {
    item(id: $id)
  }
`;

export const meta = metaQuery<itemQuery>(({ data }) => [
  { title: `${data.item} | New React Router App` },
]);

export const loader = (args: Route.LoaderArgs) =>
  loaderQuery<itemQuery>(args, query, args.params);

export const clientLoader = (args: Route.ClientLoaderArgs) =>
  clientLoaderQuery<itemQuery>(query, args.params);

export default function Item() {
  const [data] = useLoaderQuery<itemQuery>(query);

  return <p>{data.item}</p>;
}
```

Note the use of `metaQuery` from `@remix-relay/react` to define the document title using the query data.

Add the route to `app/routes.ts`:

```diff
-import { type RouteConfig, index } from "@react-router/dev/routes";
+import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
+ route("item/:id", "routes/item.tsx"),
] satisfies RouteConfig;
```

Note that the `:id` route parameter name matches the `$id` query variable. If it doesn't match, TypeScript will complain.

Run the dev server and navigate to [http://localhost:3000/item/1](http://localhost:3000/item/1) to see "Item #1" reflected back on both the page and document title.

## Client navigation

Let's add some nav links to test out client navigation.

Add an `app/components/Layout.tsx` file.

```typescript
import { type NavLinkProps, NavLink, Outlet } from "react-router";

function Link(props: NavLinkProps) {
  return (
    <NavLink
      className="hover:underline [&.active]:font-bold [&.pending]:text-gray-500"
      prefetch="render"
      {...props}
    />
  );
}

export default function Layout() {
  return (
    <div className="m-4">
      <header className="mb-4">
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/item/1">Item #1</Link>
            </li>
            <li>
              <Link to="/item/2">Item #2</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

Setting `prefetch="render"` on `NavLink` will eagerly load the code for the linked route.

Update the `routes.ts` file to use this component as a [layout](https://reactrouter.com/start/framework/routing#layout-routes).

```diff
-import { type RouteConfig, index, route } from "@react-router/dev/routes";
+import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
+  layout("components/Layout.tsx", [
    index("routes/home.tsx"),
    route("item/:id", "routes/item.tsx"),
+  ]),
] satisfies RouteConfig;
```

Run the dev server and navigate between pages using the links. Use the browser dev tools network panel to confirm that client navigations fetch data from the `/graphql` endpoint, and that no network requests are made if the data is already present in the Relay store.
