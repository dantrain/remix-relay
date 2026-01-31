import { useDndContext } from "@dnd-kit/core";
import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, Ref, useRef, useState } from "react";
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
  columnRef: ColumnFragment$key;
  connectionId: string;
  children: ReactNode;
  style?: CSSProperties;
  hover?: boolean;
  hidden?: boolean;
  handleProps?: HandleProps;
  ref?: Ref<HTMLDivElement>;
};

export function Column({
  columnRef,
  connectionId,
  children,
  handleProps,
  hover,
  hidden,
  style,
  ref,
  ...props
}: ColumnProps) {
  const data = useFragment(fragment, columnRef);
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
        `z-10 flex max-h-full min-h-[140px] w-72 flex-col self-start
        overflow-hidden rounded-md border border-[#d6dee8] outline-none sm:w-80`,
        hover ? "bg-[#e9eef4]" : "bg-slate-100",
        dragOverlay &&
          (isFocusVisible ? "shadow-lg ring-4 ring-sky-500" : "shadow-md"),
        hidden && "hidden",
      )}
    >
      <div
        className="group flex items-center justify-between gap-2 py-1 pr-2 pl-1"
      >
        <ColumnTitle columnRef={data} />
        <div
          className={cx(
            "flex sm:gap-1",
            !active && "group-hover:opacity-100",
            !dragOverlay && "pointer-fine:opacity-0",
            isFocusVisible && "focus-within:opacity-100",
          )}
        >
          <DeleteColumn id={id} connectionId={connectionId} title={title} />
          <Handle {...handleProps} dragOverlay={dragOverlay} />
        </div>
      </div>
      <div
        className="sm:scrollbar-thin sm:scrollbar-track-slate-100
          sm:scrollbar-thumb-slate-400 sm:scrollbar-thumb-rounded-full
          sm:hover:scrollbar-thumb-slate-500 sm:active:scrollbar-thumb-slate-500
          flex-1 overflow-y-auto"
        ref={scrollContainerRef}
      >
        <AutoHeight duration={isCreating ? 0 : 200}>
          <ul
            className={cx(
              "flex flex-col gap-2 px-2",
              itemConnection.edges.length && "pb-1",
            )}
          >
            {children}
          </ul>
        </AutoHeight>
      </div>
      <div className={cx("p-2", itemConnection.edges.length ? "pt-1" : "pt-0")}>
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
}
