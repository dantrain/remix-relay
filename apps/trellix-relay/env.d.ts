declare namespace Express {
  export interface Request {
    context: import("./server/index").RequestContext;
  }
}
