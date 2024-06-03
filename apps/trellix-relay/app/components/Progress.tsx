import { useEffect, useState } from "react";
import { Progress as UiProgress } from "@remix-relay/ui";

class Target extends EventTarget {}
const target = new Target();

const delay = 500;
let inFlight = 0;

export const trackPromise = async (trackedPromise: Promise<void>) => {
  const result = await Promise.race([
    trackedPromise,
    new Promise((resolve) => setTimeout(() => resolve("SLOW"), delay)),
  ]);

  if (result !== "SLOW") {
    return;
  }

  if (inFlight === 0) {
    target.dispatchEvent(new Event("LOAD_START"));
  }

  inFlight++;

  await trackedPromise.finally();

  inFlight = Math.max(0, inFlight - 1);

  if (inFlight === 0) {
    target.dispatchEvent(new Event("LOAD_END"));
  }
};

export default function Progress() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => setIsLoading(true);
    const end = () => setIsLoading(false);

    target.addEventListener("LOAD_START", start);
    target.addEventListener("LOAD_END", end);

    return () => {
      target.removeEventListener("LOAD_START", start);
      target.removeEventListener("LOAD_END", end);
    };
  }, [setIsLoading]);

  return <UiProgress isLoading={isLoading} />;
}
