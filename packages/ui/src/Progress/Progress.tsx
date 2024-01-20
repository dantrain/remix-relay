import { useNProgress } from "@tanem/react-nprogress";
import { useEffect, useState } from "react";

export function Progress({ isLoading }: { isLoading: boolean }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (isLoading) {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsAnimating(true);
        setIsVisible(true);
      }, 300);
    } else {
      setIsAnimating(false);

      timeout = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration * 2);
    }

    return () => clearTimeout(timeout);
  }, [animationDuration, isLoading]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 h-1 overflow-hidden"
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        className="absolute left-0 z-50 h-[2px] w-full"
        style={{
          marginLeft: `${isVisible ? (-1 + progress) * 100 : -100}%`,
          transition: `margin-left ${
            isAnimating ? animationDuration : 0
          }ms linear`,
        }}
      >
        <div
          className="absolute right-0 h-full w-28 translate-x-[1px] translate-y-[-4px] rotate-3 bg-white"
          style={{
            boxShadow: "0 0 10px rgb(255 255 255), 0 0 5px rgb(255 255 255)",
          }}
        />
        <div className="relative z-10 h-full w-full bg-white" />
      </div>
    </div>
  );
}
