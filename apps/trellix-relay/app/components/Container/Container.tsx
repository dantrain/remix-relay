import { cx } from "class-variance-authority";
import { CSSProperties, ReactNode, forwardRef } from "react";
import { ActionProps } from "../Action/Action";
import { Handle } from "../Handle/Handle";
import { Remove } from "../Remove/Remove";
import styles from "./Container.module.css";

export type ContainerProps = {
  children: ReactNode;
  columns?: number;
  label?: string;
  style?: CSSProperties;
  hover?: boolean;
  handleProps?: ActionProps;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  onClick?(): void;
  onRemove?(): void;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      columns = 1,
      handleProps,
      hover,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      ...props
    }: ContainerProps,
    ref,
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        style={
          {
            ...style,
            "--columns": columns,
          } as CSSProperties
        }
        className={cx(
          styles.Container,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow,
        )}
      >
        {label ? (
          <div className={styles.Header}>
            {label}
            <div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </div>
    );
  },
);

Container.displayName = "Container";
