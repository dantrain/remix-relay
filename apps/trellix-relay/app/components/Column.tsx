import { useDndContext } from "@dnd-kit/core";
import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef, useRef, useState } from "react";
import { useFocusVisible } from "react-aria";
import { graphql, useFragment } from "react-relay";
import { useSubscribe } from "~/hooks/useSubscribe";
import AutoHeight from "./AutoHeight";
import { ColumnTitle } from "./ColumnTitle";
import { CreateItem } from "./CreateItem";
import { DeleteColumn } from "./DeleteColumn";
import { Handle, HandleProps } from "./Handle";
import { ColumnFragment$key } from "./__generated__/ColumnFragment.graphql";

const fragment = graphql`
  fragment ColumnFragment on Column {
    id
    title
    ...ColumnTitleFragment
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

const subscription = graphql`
  subscription ColumnSubscription($id: ID!) {
    column(id: $id) {
      rank
      ...ColumnFragment
    }
  }
`;

export type ColumnProps = {
  dataRef: ColumnFragment$key;
  connectionId: string;
  children: ReactNode;
  style?: CSSProperties;
  hover?: boolean;
  hidden?: boolean;
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
      hidden,
      style,
      ...props
    }: ColumnProps,
    ref,
  ) => {
    const data = useFragment(fragment, dataRef);
    const { id, title, itemConnection } = data;

    useSubscribe({ subscription, variables: { id } });

    const { active } = useDndContext();
    const [isCreating, setIsCreating] = useState(false);

    const { isFocusVisible } = useFocusVisible({ isTextInput: true });

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
          `z-10 flex max-h-full min-h-[140px] w-64 flex-col self-start
          overflow-hidden rounded-md border border-[#d6dee8] outline-none
          transition-colors duration-200 sm:w-80`,
          hover ? "bg-[#e9eef4]" : "bg-slate-100",
          dragOverlay && "shadow-md",
          hidden && "hidden",
        )}
      >
        <div
          className="group flex items-center justify-between gap-2 py-1 pl-1
            pr-2"
        >
          <ColumnTitle dataRef={data} />
          <div
            className={cx(
              "flex sm:gap-1",
              !active && "group-hover:opacity-100",
              !dragOverlay && "sm:opacity-0",
              isFocusVisible && "focus-within:opacity-100",
            )}
          >
            <DeleteColumn id={id} connectionId={connectionId} title={title} />
            <Handle {...handleProps} dragOverlay={dragOverlay} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          <AutoHeight duration={isCreating ? 0 : 200}>
            <ul className="flex flex-col gap-2 px-2">{children}</ul>
          </AutoHeight>
        </div>
        <div className={cx("p-2", !itemConnection.edges.length && "pt-0")}>
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
