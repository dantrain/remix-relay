<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/adf6eedb-2c9e-4680-b058-dab4e6d1ea55">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/dantrain/remix-relay/assets/1765203/c2ab83b9-7e23-445d-b6cb-de4b3aff5d2e">
    <img alt="remix-relay logo" width="400" src="https://github.com/dantrain/remix-relay/assets/1765203/c2ab83b9-7e23-445d-b6cb-de4b3aff5d2e">
  </picture>
</p>

<h1 align="center">remix-relay</h1>

<a href="https://www.npmjs.com/package/@remix-relay/react"><img alt="NPM Version" src="https://img.shields.io/npm/v/%40remix-relay%2Freact?label=%40remix-relay%2Freact"></a>
<a href="https://www.npmjs.com/package/@remix-relay/server"><img alt="NPM Version" src="https://img.shields.io/npm/v/%40remix-relay%2Fserver?label=%40remix-relay%2Fserver"  hspace="10"></a>

A small library providing integration between the [React Router v7](https://reactrouter.com/) framework (formerly [Remix](https://remix.run/)) and the [Relay](https://relay.dev/) GraphQL client.

## Docs

[Getting started guide](docs/getting-started.md)

## Examples

| [Movie app](https://dans-movie-app.pages.dev/) | [Counter app](https://dans-counter-app.fly.dev/) | [Trellix](https://trellix-relay.fly.dev/) |
| :---: | :---: | :---: |
| [<img alt="Movie app" src="https://github.com/user-attachments/assets/b4a9d786-9795-4b9a-88e0-2cd2b308e06e">](https://dans-movie-app.pages.dev/) | [<img alt="Counter app" src="https://github.com/user-attachments/assets/d283529f-c938-4fd5-b49e-9823982d12c6">](https://dans-counter-app.fly.dev/) | [<img alt="Trellix" src="https://github.com/user-attachments/assets/fb56b4ec-bc69-424f-9f97-981a67af3a04">](https://trellix-relay.fly.dev/) |

## Sequence diagrams

### Relay SPA (no @defer)

```mermaid
sequenceDiagram
  Browser->>+Server: GET /
  Server-->>-Browser: Document
  Note over Browser: First paint
  Browser->>+Server: GET /assets/bundle.js
  Server-->>-Browser: bundle.js
  Browser->>Browser: Render suspense fallback
  Browser->>+Server: POST /graphql
  Server->>+DB: Get Movie
  DB-->>-Server: Movie data
  Server->>+DB: Get Reviews
  DB-->>-Server: Reviews data
  Server-->>-Browser: Data
  Browser->>Browser: Render complete page
  Note over Browser: First meaningful paint
  Note over Browser: Done
```

### remix-relay (no @defer)

```mermaid
sequenceDiagram
  Browser->>+Server: GET /
  Server->>+DB: Get Movie
  DB-->>-Server: Movie data
  Server->>+DB: Get Reviews
  DB-->>-Server: Reviews data
  Server->>Server: Render complete page
  Server-->>-Browser: Document
  Note over Browser: First meaningful paint
  Browser->>+Server: GET /assets/bundle.js
  Server-->>-Browser: bundle.js
  Browser->>Browser: Rehydrate
  Note over Browser: Interactive
  Note over Browser: Done
```

### remix-relay (with @defer)

```mermaid
sequenceDiagram
  Browser->>+Server: GET /
  Server->>+DB: Get Movie
  DB-->>-Server: Movie data
  Server->>+DB: Get Reviews
  Server->>Server: Render Movie details
  Server-->>Browser: Chunk 1
  Note over Browser: First meaningful paint
  Browser->>+Server: GET /assets/bundle.js
  Server-->>-Browser: bundle.js
  Browser->>Browser: Rehydrate
  Note over Browser: Interactive
  DB-->>-Server: Reviews data
  Server-->>-Browser: Chunk 2
  Browser->>Browser: Render complete page
  Note over Browser: Done
```
