import { UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cx } from "class-variance-authority";
import { ReactNode } from "react";

type PlaceholderColumnProps = {
  id: UniqueIdentifier;
  children?: ReactNode;
};

export function PlaceholderColumn({ id, children }: PlaceholderColumnProps) {
  const { active, over, setNodeRef, transition, transform } = useSortable({
    id,
    data: { type: "container" },
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  });

  const isOverContainer = over
    ? id === over.id && active?.data.current?.type !== "container"
    : false;

  return (
    <div
      className={cx(
        `flex min-h-[132px] min-w-80 items-center justify-center rounded-md
        border border-dashed border-slate-400`,
        isOverContainer && "bg-[#e9eef4]",
      )}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
}
