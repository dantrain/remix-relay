import { forwardRef, CSSProperties, HTMLAttributes } from "react";

export type ActionProps = HTMLAttributes<HTMLButtonElement> & {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
};

export const Action = forwardRef<HTMLButtonElement, ActionProps>(
  ({ active, cursor, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        aria-describedby={undefined}
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
