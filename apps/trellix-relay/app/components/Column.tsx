import { useDndContext } from "@dnd-kit/core";
import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef, useRef, useState } from "react";
import { graphql, useFragment } from "react-relay";
import AutoHeight from "./AutoHeight";
import { CreateItem } from "./CreateItem";
import { DeleteColumn } from "./DeleteColumn";
import { Handle, HandleProps } from "./Handle";
import { ColumnFragment$key } from "./__generated__/ColumnFragment.graphql";

const fragment = graphql`
  fragment ColumnFragment on Column {
    id
    title
    itemConnection {
      __id
      edges {
        node {
          id
          rank
        }
      }
    }
  }
`;

export type ColumnProps = {
  dataRef: ColumnFragment$key;
  connectionId: string;
  children: ReactNode;
  style?: CSSProperties;
  hover?: boolean;
  handleProps?: HandleProps;
};

export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  (
    {
      dataRef,
      connectionId,
      children,
      handleProps,
      hover,
      style,
      ...props
    }: ColumnProps,
    ref,
  ) => {
    const { id, title, itemConnection } = useFragment(fragment, dataRef);
    const { active } = useDndContext();
    const [isCreating, setIsCreating] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "instant",
      });
    };

    const dragOverlay = id === active?.id;

    return (
      <div
        {...props}
        ref={ref}
        style={style}
        className={cx(
          `z-10 flex max-h-full min-h-36 w-80 flex-col self-start
          overflow-hidden rounded-md border border-[#d6dee8] outline-none
          transition-colors duration-200`,
          hover ? "bg-[#e9eef4]" : "bg-slate-100",
          dragOverlay && "shadow-md",
        )}
      >
        <div
          className="group flex items-center justify-between px-3 py-2
            font-medium text-slate-800"
        >
          {title}
          <div
            className={cx(
              "flex sm:gap-1",
              !active && "focus-within:opacity-100 group-hover:opacity-100",
              !dragOverlay && "sm:opacity-0",
            )}
          >
            <DeleteColumn id={id} connectionId={connectionId} title={title} />
            <Handle {...handleProps} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          <AutoHeight duration={isCreating ? 0 : 200}>
            <ul className="flex flex-col gap-2 px-2">{children}</ul>
          </AutoHeight>
        </div>
        <div className="p-2">
          <CreateItem
            connectionId={itemConnection.__id}
            columnId={id}
            itemEdges={itemConnection.edges}
            scrollToBottom={scrollToBottom}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </div>
      </div>
    );
  },
);

Column.displayName = "Container";
