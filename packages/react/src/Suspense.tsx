import {
  Suspense as ReactSuspense,
  SuspenseProps,
  use,
  useEffect,
  useState,
} from "react";
import { Await } from "react-router";
import { DeferredQueryContext } from "./deferred-query-context";

export function Suspense({ children, ...rest }: SuspenseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && typeof window !== "undefined") {
      setMounted(true);
    }
  }, [mounted]);

  const deferredQuery = use(DeferredQueryContext);

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
