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

  // SSR or context not yet initialized - show fallback
  if (!mounted || deferredQuery === undefined) {
    return <>{rest.fallback}</>;
  }

  // No deferred data in this query - render children directly
  if (deferredQuery === null) {
    return <>{children}</>;
  }

  // Has deferred data - use Await
  return (
    <Suspense {...rest}>
      <Await resolve={deferredQuery}>{children}</Await>
    </Suspense>
  );
}
