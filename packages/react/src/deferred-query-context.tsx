import type { PropsWithChildren } from "react";
import { createContext, use, useMemo, useSyncExternalStore } from "react";

type DeferredQueryValue = Promise<unknown> | null | undefined;

type DeferredQueryStore = {
  get: () => DeferredQueryValue;
  set: (value: DeferredQueryValue) => void;
  subscribe: (listener: () => void) => () => void;
};

function createDeferredQueryStore(): DeferredQueryStore {
  let value: DeferredQueryValue = undefined;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export const DeferredQueryStoreContext = createContext<DeferredQueryStore>(
  createDeferredQueryStore(),
);

export function useDeferredQuery(): DeferredQueryValue {
  const store = use(DeferredQueryStoreContext);
  return useSyncExternalStore(store.subscribe, store.get, () => undefined);
}

export function RemixRelayProvider({ children }: PropsWithChildren) {
  const store = useMemo(() => createDeferredQueryStore(), []);

  return (
    <DeferredQueryStoreContext value={store}>
      {children}
    </DeferredQueryStoreContext>
  );
}
