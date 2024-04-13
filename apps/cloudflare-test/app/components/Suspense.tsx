import {
  Suspense as ReactSuspense,
  useEffect,
  useState,
  type SuspenseProps,
} from "react";

export function Suspense(props: SuspenseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && typeof window !== "undefined") {
      setMounted(true);
    }
  }, [mounted]);

  return mounted ? <ReactSuspense {...props} /> : <>{props.fallback}</>;
}
