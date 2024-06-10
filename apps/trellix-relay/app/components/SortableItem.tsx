import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { ReactNode } from "react";
import { Item } from "./Item";

export type SortableItemProps = {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  children?: ReactNode;
};

export function SortableItem({ id, children }: SortableItemProps) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
    >
      {children}
    </Item>
  );
}
