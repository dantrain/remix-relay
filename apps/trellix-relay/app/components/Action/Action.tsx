import { cx } from "class-variance-authority";
import { forwardRef, CSSProperties, HTMLAttributes } from "react";
import styles from "./Action.module.css";

export type ActionProps = HTMLAttributes<HTMLButtonElement> & {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
};

export const Action = forwardRef<HTMLButtonElement, ActionProps>(
  ({ active, className, cursor, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        aria-describedby={undefined}
        className={cx(styles.Action, className)}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            "--fill": active?.fill,
            "--background": active?.background,
          } as CSSProperties
        }
      />
    );
  },
);

Action.displayName = "Action";
