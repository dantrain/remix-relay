<p align="center">
  <img src="https://github.com/dantrain/remix-relay/assets/1765203/c2ab83b9-7e23-445d-b6cb-de4b3aff5d2e" width="400"/>
</p>

<h1 align="center">remix-relay</h1>

![NPM Version](https://img.shields.io/npm/v/%40remix-relay%2Fserver)
![NPM Version](https://img.shields.io/npm/v/%40remix-relay%2Freact)

## Examples

- [Movie app](https://dans-movie-app.pages.dev/)
- [Counter app](https://dans-counter-app.fly.dev/)
- [Trellix](https://trellix-relay.fly.dev/)

## Installation

- `npm install @remix-relay/react @remix-relay/server react-relay relay-runtime graphql@17.0.0-alpha.2`

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
