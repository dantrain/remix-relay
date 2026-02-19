---
"@remix-relay/react": major
"@remix-relay/server": major
---

Stream @defer chunks incrementally via linked-promise chain

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
