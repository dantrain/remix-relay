import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { cva, cx } from "class-variance-authority";
import { CSSProperties, forwardRef, memo, useEffect } from "react";
import { useFocusVisible } from "react-aria";
import { graphql, useFragment } from "react-relay";
import { ItemFragment$key } from "./__generated__/ItemFragment.graphql";

const fragment = graphql`
  fragment ItemFragment on Item {
    id
    text
  }
`;

export type ItemProps = {
  dataRef: ItemFragment$key;
  dragOverlay?: boolean;
  dragging?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
};

export const Item = memo(
  forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        dataRef,
        dragOverlay = false,
        dragging,
        listeners,
        transition,
        transform,
        ...props
      },
      ref,
    ) => {
      const { text } = useFragment(fragment, dataRef);

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
            className={cva(
              `flex flex-grow touch-manipulation rounded-md border
              border-slate-200 bg-white px-5 py-4 outline-none`,
              {
                variants: {
                  dragging: { true: "invisible" },
                  dragOverlay: {
                    true: "cursor-[inherit]",
                    false: "cursor-grab shadow-sm",
                  },
                  isFocusVisible: { true: "ring-blue-400" },
                },
                compoundVariants: [
                  {
                    isFocusVisible: false,
                    dragOverlay: true,
                    className: "shadow-md",
                  },
                  {
                    isFocusVisible: true,
                    dragOverlay: false,
                    className: "ring-offset-2 focus:ring-2",
                  },
                  {
                    isFocusVisible: true,
                    dragOverlay: true,
                    className: "shadow-lg ring-4",
                  },
                ],
              },
            )({ dragging, dragOverlay, isFocusVisible })}
            style={{ WebkitTapHighlightColor: "transparent" } as CSSProperties}
            {...listeners}
            {...props}
            type="button"
            tabIndex={0}
          >
            {text}
          </button>
        </li>
      );
    },
  ),
);
