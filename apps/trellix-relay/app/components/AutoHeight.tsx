import { useEffect, useRef, useState } from "react";
import AnimateHeight, { AnimateHeightProps } from "react-animate-height";

export default function AutoHeight({
  children,
  ...props
}: Omit<AnimateHeightProps, "height" | "contentRef">) {
  const [height, setHeight] = useState<number>(0);
  const contentDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = contentDiv.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(Math.round(element.clientHeight));
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <AnimateHeight
      {...props}
      height={height || "auto"}
      contentRef={contentDiv}
      disableDisplayNone
    >
      {children}
    </AnimateHeight>
  );
}
