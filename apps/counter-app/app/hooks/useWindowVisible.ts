import { useEffect } from "react";

export default function useWindowVisible(handleWindowVisible: () => void) {
  useEffect(() => {
    const visibilitychangeListener = () => {
      if (document.visibilityState === "visible") {
        handleWindowVisible();
      }
    };

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      document.addEventListener(
        "visibilitychange",
        visibilitychangeListener,
        false,
      );
    }

    return () => {
      document.removeEventListener(
        "visibilitychange",
        visibilitychangeListener,
      );
    };
  }, [handleWindowVisible]);
}
