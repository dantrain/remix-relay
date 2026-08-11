---
"@remix-relay/react": major
---

Support React Router 8

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
