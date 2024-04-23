# Remix + Relay

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

### Remix + Relay (no @defer)

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

### Remix + Relay (with @defer)

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

## Installation

- `npm install @remix-relay/react @remix-relay/server react-relay relay-runtime graphql@17.0.0-alpha.2`
