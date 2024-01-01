import { Slot } from "@radix-ui/react-slot";
import { cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";

type ButtonProps = {
  className?: string;
  children: ReactNode;
} & (
  | ({ asChild?: false } & ComponentPropsWithoutRef<"button">)
  | { asChild: true }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cx(
          className,
          "rounded-md border px-2 py-1 text-left",
          "border-slate-700 bg-slate-900",
          "hover:bg-slate-800 active:bg-slate-800",
          "hover:border-slate-600 active:border-slate-600",
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
