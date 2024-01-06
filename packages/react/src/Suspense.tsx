import { Await } from "@remix-run/react";
import {
  Suspense as ReactSuspense,
  SuspenseProps,
  useContext,
  useSyncExternalStore,
} from "react";
import { DeferredQueryContext } from "./deferred-query-context";

export function Suspense({ children, ...rest }: SuspenseProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const deferredQuery = useContext(DeferredQueryContext);

  return mounted ? (
    <ReactSuspense {...rest}>
      {deferredQuery ? (
        <Await resolve={deferredQuery}>{children}</Await>
      ) : (
        children
      )}
    </ReactSuspense>
  ) : (
    <>{rest.fallback}</>
  );
}
