import { UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { forwardRef } from "react";
import { Column, ColumnProps } from "./Column";

export type DroppableColumnProps = ColumnProps & {
  id: UniqueIdentifier;
  items?: { id: UniqueIdentifier }[];
};

export const DroppableColumn = forwardRef<HTMLDivElement, DroppableColumnProps>(
  ({ children, id, items = [], ...props }, ref) => {
    const {
      active,
      attributes,
      isDragging,
      listeners,
      over,
      setNodeRef,
      transition,
      transform,
    } = useSortable({
      id,
      data: {
        type: "container",
        children: items,
      },
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

    const isOverContainer = over
      ? (id === over.id && active?.data.current?.type !== "container") ||
        items.some(({ id }) => id === over.id)
      : false;

    return (
      <Column
        ref={(el) => {
          if (ref && typeof ref !== "function") {
            ref.current = el;
          }
          setNodeRef(el);
        }}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
          visibility: isDragging ? "hidden" : undefined,
        }}
        hover={isOverContainer}
        handleProps={{
          ...attributes,
          ...listeners,
        }}
        {...props}
      >
        {children}
      </Column>
    );
  },
);
DroppableColumn.displayName = "DroppableColumn";
