import { createContext } from "react-router";
import type { PothosContext } from "server";
import type { Env } from "server/env";

// The Express server and the React Router server build are loaded through
// separate module graphs (tsx and Vite SSR respectively), so this module is
// instantiated twice. Context keys are compared by identity, so cache them on
// globalThis to make sure both graphs share the same ones.
const globalWithContexts = globalThis as typeof globalThis & {
  __counterRouterContexts?: {
    env: ReturnType<typeof createContext<Env>>;
    pothos: ReturnType<typeof createContext<Partial<PothosContext>>>;
  };
};

const contexts = (globalWithContexts.__counterRouterContexts ??= {
  env: createContext<Env>(),
  pothos: createContext<Partial<PothosContext>>(),
});

export const envContext = contexts.env;
export const pothosContext = contexts.pothos;
