/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />
declare namespace Express {
  export interface Request {
    context: import("./server/index").RequestContext;
  }
}
