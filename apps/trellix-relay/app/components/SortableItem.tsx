import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Item, ItemProps } from "./Item";

export type SortableItemProps = {
  id: UniqueIdentifier;
  containerId: UniqueIdentifier;
  draggedFromContainer: UniqueIdentifier | null;
} & Omit<ItemProps, "dragging" | "transition" | "transform" | "listeners">;

export function SortableItem({
  id,
  containerId,
  draggedFromContainer,
  ...rest
}: SortableItemProps) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({ id });

  // Items in the source column should always have transition so they animate
  // up when a sibling is dragged away. Items in other columns should only
  // have transition when there's a transform to prevent items above the
  // drop position from animating on cross-column drop.
  const isInSourceColumn = containerId === draggedFromContainer;

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      transition={transform || isInSourceColumn ? transition : undefined}
      transform={transform}
      listeners={listeners}
      {...rest}
    />
  );
}
