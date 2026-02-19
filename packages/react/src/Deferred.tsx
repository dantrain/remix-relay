import { Suspense, SuspenseProps, useSyncExternalStore } from "react";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Deferred({ children, ...rest }: SuspenseProps) {
  const mounted = useIsMounted();

  if (!mounted) {
    return rest.fallback;
  }

  return <Suspense {...rest}>{children}</Suspense>;
}
