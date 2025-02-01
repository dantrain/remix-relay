import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { RefObject } from "react";
import { Item, ItemProps } from "./Item";

export type SortableItemProps = {
  id: UniqueIdentifier;
  recentlyMovedToNewContainer: RefObject<boolean>;
} & Omit<ItemProps, "dragging" | "transition" | "transform" | "listeners">;

export function SortableItem({
  id,
  recentlyMovedToNewContainer,
  ...rest
}: SortableItemProps) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      transition={
        transform || recentlyMovedToNewContainer.current
          ? transition
          : undefined
      }
      transform={transform}
      listeners={listeners}
      {...rest}
    />
  );
}
