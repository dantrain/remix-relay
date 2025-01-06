import { Suspense, SuspenseProps, use, useEffect, useState } from "react";
import { Await } from "react-router";
import { DeferredQueryContext } from "./deferred-query-context";

export function Deferred({ children, ...rest }: SuspenseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && typeof window !== "undefined") {
      setMounted(true);
    }
  }, [mounted]);

  const deferredQuery = use(DeferredQueryContext);

  return mounted ? (
    <Suspense {...rest}>
      {deferredQuery ? (
        <Await resolve={deferredQuery}>{children}</Await>
      ) : (
        children
      )}
    </Suspense>
  ) : (
    <>{rest.fallback}</>
  );
}
