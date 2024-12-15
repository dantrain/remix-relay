import { UniqueIdentifier } from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ref } from "react";
import { Column, ColumnProps } from "./Column";

export type DroppableColumnProps = ColumnProps & {
  id: UniqueIdentifier;
  items?: { id: UniqueIdentifier }[];
  ref?: Ref<HTMLDivElement>;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export function DroppableColumn({
  children,
  id,
  items = [],
  ref,
  ...props
}: DroppableColumnProps) {
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
    animateLayoutChanges,
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
        transition: transform ? transition : undefined,
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
}

DroppableColumn.displayName = "DroppableColumn";
