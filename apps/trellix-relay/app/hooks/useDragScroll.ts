import { MouseEvent, RefObject, useRef } from "react";

export default function useDragScroll(ref: RefObject<HTMLDivElement | null>) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const momentumFrame = useRef<number | null>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 1 && e.button !== 2) return; // Only allow right or middle mouse button
    if (!ref.current) return;

    isDragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;

    ref.current.style.cursor = "grabbing";

    velocity.current = 0;
    lastX.current = e.pageX;

    if (momentumFrame.current) {
      cancelAnimationFrame(momentumFrame.current);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();

    const x = e.pageX - (ref.current?.offsetLeft ?? 0);
    const deltaX = x - lastX.current;

    velocity.current = deltaX;
    lastX.current = x;

    ref.current.scrollLeft = (scrollLeft.current ?? 0) - (x - startX.current);
  };

  const handleMouseUp = () => {
    if (!ref.current) return;

    isDragging.current = false;
    ref.current.style.cursor = "";

    applyMomentum();
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;

    isDragging.current = false;
    ref.current.style.cursor = "";

    applyMomentum();
  };

  const applyMomentum = () => {
    const apply = () => {
      if (!ref.current) return;

      // eslint-disable-next-line react-compiler/react-compiler
      ref.current.scrollLeft -= velocity.current;
      velocity.current *= 0.95; // Damping factor

      if (Math.abs(velocity.current) > 0.5) {
        momentumFrame.current = requestAnimationFrame(apply);
      } else {
        momentumFrame.current = null;
      }
    };

    apply();
  };

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
}
