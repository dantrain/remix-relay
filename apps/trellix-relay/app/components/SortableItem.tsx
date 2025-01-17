import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Item, ItemProps } from "./Item";

export type SortableItemProps = { id: UniqueIdentifier } & Omit<
  ItemProps,
  "dragging" | "transition" | "transform" | "listeners"
>;

export function SortableItem({ id, ...rest }: SortableItemProps) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      // transition={transform ? transition : undefined}
      transition={transition}
      transform={transform}
      listeners={listeners}
      {...rest}
    />
  );
}
