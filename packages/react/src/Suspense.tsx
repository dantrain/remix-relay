import { Await } from "@remix-run/react";
import {
  Suspense as ReactSuspense,
  SuspenseProps,
  useContext,
  useEffect,
  useState,
} from "react";
import { DeferredQueryContext } from "./deferred-query-context";

export function Suspense({ children, ...rest }: SuspenseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && typeof window !== "undefined") {
      setMounted(true);
    }
  }, [mounted]);

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
