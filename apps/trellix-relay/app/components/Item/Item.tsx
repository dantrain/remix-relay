import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef, memo, useEffect } from "react";
import { Remove } from "../Remove/Remove";
import styles from "./Item.module.css";

export type ItemProps = {
  dragOverlay?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  height?: number;
  index?: number;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  style?: CSSProperties;
  transition?: string | null;
  value: ReactNode;
  onRemove?(): void;
};

export const Item = memo(
  forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        dragOverlay,
        dragging,
        disabled,
        index,
        listeners,
        onRemove,
        style,
        transition,
        transform,
        value,
        ...props
      },
      ref,
    ) => {
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
          className={cx(styles.Wrapper, dragOverlay && styles.dragOverlay)}
          style={
            {
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
              "--index": index,
            } as CSSProperties
          }
          ref={ref}
        >
          <div
            className={cx(
              styles.Item,
              dragging && styles.dragging,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled,
              "bg-white",
            )}
            style={style}
            {...listeners}
            {...props}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            {value}
            <span className={styles.Actions}>
              {onRemove ? (
                <Remove className={styles.Remove} onClick={onRemove} />
              ) : null}
            </span>
          </div>
        </li>
      );
    },
  ),
);
