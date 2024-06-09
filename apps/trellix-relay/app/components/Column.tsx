import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef } from "react";
import { graphql, useFragment } from "react-relay";
import { ActionProps } from "./Action";
import { DeleteColumn } from "./DeleteColumn";
import { Handle } from "./Handle";
import { ColumnFragment$key } from "./__generated__/ColumnFragment.graphql";

const fragment = graphql`
  fragment ColumnFragment on Column {
    id
    title
  }
`;

export type ColumnProps = {
  dataRef: ColumnFragment$key;
  connectionId: string;
  children: ReactNode;
  style?: CSSProperties;
  hover?: boolean;
  handleProps?: ActionProps;
  shadow?: boolean;
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
      shadow,
      ...props
    }: ColumnProps,
    ref,
  ) => {
    const { id, title } = useFragment(fragment, dataRef);

    return (
      <div
        {...props}
        ref={ref}
        style={style}
        className={cx(
          `z-10 flex min-h-52 min-w-80 flex-col overflow-hidden rounded-md
          border outline-none transition-colors duration-200`,
          hover ? "bg-[#e9eef4]" : "bg-slate-100",
          shadow && "shadow-md",
        )}
      >
        <div
          className="flex justify-between px-3 pt-2 font-medium text-slate-700"
        >
          {title}
          <div className="flex gap-2">
            <DeleteColumn id={id} connectionId={connectionId} />
            <Handle {...handleProps} />
          </div>
        </div>
        <ul className="flex flex-col gap-2 p-2">{children}</ul>
      </div>
    );
  },
);

Column.displayName = "Container";
