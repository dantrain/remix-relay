import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef } from "react";
import { ActionProps } from "./Action";
import { Handle } from "./Handle";
import { Remove } from "./Remove";

export type ContainerProps = {
  children: ReactNode;
  label?: string;
  style?: CSSProperties;
  hover?: boolean;
  handleProps?: ActionProps;
  shadow?: boolean;
  placeholder?: boolean;
  onClick?(): void;
  onRemove?(): void;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      handleProps,
      hover,
      onRemove,
      label,
      placeholder,
      style,
      shadow,
      ...props
    }: ContainerProps,
    ref,
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        style={style}
        className={cx(
          `flex min-h-52 min-w-80 flex-col overflow-hidden rounded-md border
          outline-none transition-colors duration-200`,
          !placeholder && "border-slate-300",
          hover ? "bg-[#e9eef4]" : "bg-slate-100",
          shadow && "shadow-md",
          placeholder &&
            "items-center justify-center border-dashed border-slate-400",
          placeholder && !hover && "bg-transparent",
        )}
      >
        {label ? (
          <div
            className="flex justify-between px-3 pt-2 font-medium text-slate-700"
          >
            {label}
            <div className="flex gap-2">
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? (
          children
        ) : (
          <ul className="flex flex-col gap-2 p-2">{children}</ul>
        )}
      </div>
    );
  },
);

Container.displayName = "Container";
