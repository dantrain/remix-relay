# Getting started

Follow this guide to build a basic web app with remix-relay and learn how it works. You will:

 - Server side render a Home page with fast-loading data from a GraphQL API.
 - Stream in slow-loading data with `@defer`.
 - Server side render an Item page, using a route parameter as a query variable.
 - Use the Relay cache for client navigations.

### React Router app

Start by creating a new React Router application with the `node-custom-server` template, as per the [React Router docs](https://reactrouter.com/start/framework/installation).

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
// server/graphql-schema.ts
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

