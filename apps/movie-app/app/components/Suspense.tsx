import {
  Suspense as ReactSuspense,
  SuspenseProps,
  useSyncExternalStore,
} from "react";

export function Suspense({ children, ...rest }: SuspenseProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return mounted ? (
    <ReactSuspense {...rest}>{children}</ReactSuspense>
  ) : (
    <>{rest.fallback}</>
  );
}
