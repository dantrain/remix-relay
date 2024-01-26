import { Slot } from "@radix-ui/react-slot";
import { cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

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
        className={twMerge(
          cx(
            "select-none rounded-md border px-2 py-1 text-left",
            "border-slate-700 bg-slate-900",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "active:bg-slate-800 sm:hover:bg-slate-800",
            "active:disabled:bg-slate-900 sm:hover:disabled:bg-slate-900",
            "active:border-slate-600 sm:hover:border-slate-600",
            "active:disabled:border-slate-700 sm:hover:disabled:border-slate-700",
          ),
          className,
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
