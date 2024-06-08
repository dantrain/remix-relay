import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Item } from "../Item/Item";

export type SortableItemProps = {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
};

export function SortableItem({ id }: SortableItemProps) {
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
      {id}
    </Item>
  );
}
