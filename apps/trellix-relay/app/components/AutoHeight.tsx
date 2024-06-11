import { useEffect, useRef, useState } from "react";
import AnimateHeight, { AnimateHeightProps } from "react-animate-height";

function AutoHeight({
  children,
  ...props
}: Omit<AnimateHeightProps, "height" | "contentRef">) {
  const [height, setHeight] = useState<number>(0);
  const contentDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = contentDiv.current as HTMLDivElement;
    let timeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      const newHeight = element.clientHeight;

      clearTimeout(timeout);

      if (newHeight >= height) {
        setHeight(newHeight);
      } else {
        timeout = setTimeout(() => setHeight(newHeight), 200);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [height]);

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

AutoHeight.displayName = "AutoHeight";

export default AutoHeight;
