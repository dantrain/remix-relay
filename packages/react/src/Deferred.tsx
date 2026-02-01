import { Suspense, SuspenseProps, use, useSyncExternalStore } from "react";
import { Await } from "react-router";
import { DeferredQueryContext } from "./deferred-query-context";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Deferred({ children, ...rest }: SuspenseProps) {
  const mounted = useIsMounted();
  const deferredQuery = use(DeferredQueryContext);

  // SSR or context not yet set - show fallback
  if (!mounted || deferredQuery === undefined) {
    return <>{rest.fallback}</>;
  }

  // Always wrap in Suspense to catch any suspension
  return (
    <Suspense {...rest}>
      {deferredQuery ? (
        <Await resolve={deferredQuery}>{children}</Await>
      ) : (
        children
      )}
    </Suspense>
  );
}
