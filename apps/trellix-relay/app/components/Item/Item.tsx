import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef, memo, useEffect } from "react";
import { useFocusVisible } from "react-aria";

export type ItemProps = {
  dragOverlay?: boolean;
  dragging?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
  children: ReactNode;
};

export const Item = memo(
  forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        dragOverlay,
        dragging,
        listeners,
        transition,
        transform,
        children,
        ...props
      },
      ref,
    ) => {
      const { isFocusVisible } = useFocusVisible({ isTextInput: true });

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return (
        <li
          className={cx("flex touch-manipulation", dragOverlay && "z-50")}
          style={
            {
              transform:
                "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))",
              transition,
              "--translate-x": transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              "--translate-y": transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              "--scale-x": transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              "--scale-y": transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
            } as CSSProperties
          }
          ref={ref}
        >
          <button
            className={cx(
              `flex flex-grow cursor-grab touch-manipulation rounded-md border
              border-slate-100 bg-white px-5 py-4 shadow-sm outline-none`,
              isFocusVisible && "ring-blue-400 ring-offset-2 focus:ring-2",
              dragging && "invisible",
              dragOverlay && "cursor-[inherit] shadow-md",
              isFocusVisible && dragOverlay && "ring-4 ring-offset-0",
            )}
            style={{ WebkitTapHighlightColor: "transparent" } as CSSProperties}
            {...listeners}
            {...props}
            type="button"
            tabIndex={0}
          >
            {children}
          </button>
        </li>
      );
    },
  ),
);
