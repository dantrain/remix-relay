import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Item, ItemProps } from "./Item";

export type SortableItemProps = {
  id: UniqueIdentifier;
  containerId: UniqueIdentifier;
  activeItemContainer: UniqueIdentifier | null | undefined;
} & Omit<ItemProps, "dragging" | "transition" | "transform" | "listeners">;

export function SortableItem({
  id,
  containerId,
  activeItemContainer,
  ...rest
}: SortableItemProps) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({ id });

  // Items in columns that the dragged item has LEFT should always have
  // transition so they animate to fill the gap. Items in the column the
  // dragged item is currently IN should only have transition when there's
  // a transform to prevent items above the drop position from animating.
  const shouldForceTransition =
    activeItemContainer != null && containerId !== activeItemContainer;

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      transition={transform || shouldForceTransition ? transition : undefined}
      transform={transform}
      listeners={listeners}
      {...rest}
    />
  );
}
