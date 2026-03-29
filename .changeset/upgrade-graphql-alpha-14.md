---
"@remix-relay/server": minor
"@remix-relay/react": minor
---

Upgrade `graphql` peer dependency from `17.0.0-alpha.9` to `17.0.0-alpha.14`.

This follows the incremental delivery rewrite in graphql-js alpha.10, which added back-pressure sensitivity to `@defer`/`@stream` execution.

**Apollo Server compatibility:** Apollo Server (up to v5.5.0) has a hardcoded version check for `graphql@17.0.0-alpha.9` and will not use `experimentalExecuteIncrementally` with alpha.14, causing schemas with `@defer`/`@stream` directives to throw. A patch is required -- see the `patches/@apollo__server@5.5.0.patch` in the repo for reference.
