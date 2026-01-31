import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useState } from "react";

export const DeferredQueryContext = createContext<Promise<unknown> | null>(
  null,
);
export const SetDeferredQueryContext = createContext<
  Dispatch<SetStateAction<Promise<unknown> | null>>
>(() => {});

export function RemixRelayProvider({ children }: PropsWithChildren) {
  const [deferredQueries, setDeferredQueries] =
    useState<Promise<unknown> | null>(null);

  return (
    <SetDeferredQueryContext value={setDeferredQueries}>
      <DeferredQueryContext value={deferredQueries}>
        {children}
      </DeferredQueryContext>
    </SetDeferredQueryContext>
  );
}
