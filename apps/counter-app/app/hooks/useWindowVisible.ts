import { useEffect } from "react";

export default function useWindowVisible(handleWindowVisible: () => void) {
  useEffect(() => {
    const visibilitychangeListener = () => {
      if (document.visibilityState === "visible") {
        handleWindowVisible();
      }
    };

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      window.addEventListener("online", visibilitychangeListener, false);

      document.addEventListener(
        "visibilitychange",
        visibilitychangeListener,
        false,
      );
    }

    return () => {
      window.removeEventListener("online", visibilitychangeListener);

      document.removeEventListener(
        "visibilitychange",
        visibilitychangeListener,
      );
    };
  }, [handleWindowVisible]);
}
