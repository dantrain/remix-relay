import { Slot } from "@radix-ui/react-slot";
import { useObjectRef } from "@react-aria/utils";
import { cva } from "class-variance-authority";
import type { ReactElement, ReactNode } from "react";
import { Children, forwardRef } from "react";
import { AriaButtonOptions, useButton, useFocusVisible } from "react-aria";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  className?: string;
  color?: "slate" | "sky";
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
} & (({ asChild?: false } & AriaButtonOptions<"button">) | { asChild: true });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      color = "slate",
      disabled = false,
      onClick,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const ref = useObjectRef(forwardedRef);
    const Comp = asChild && !disabled ? Slot : "button";

    const { isFocusVisible } = useFocusVisible({ isTextInput: true });

    const { buttonProps, isPressed } = useButton(
      { onPress: onClick, ...rest, isDisabled: disabled },
      ref,
    );

    return (
      <Comp
        className={twMerge(
          cva(
            `inline-block cursor-pointer select-none rounded-md px-2 py-1
            transition-colors focus:outline-none sm:transition-none`,
            {
              variants: {
                color: {
                  slate: "border border-slate-700 bg-slate-900 text-white",
                  sky: "bg-[#0894d8] text-white",
                },
                disabled: {
                  true: "cursor-not-allowed opacity-60",
                },
                isPressed: { true: "" },
                isFocusVisible: {
                  true: "ring-offset-2 focus:ring-2",
                },
              },
              compoundVariants: [
                {
                  isFocusVisible: true,
                  color: "slate",
                  className: "ring-blue-400 ring-offset-slate-950",
                },
                {
                  isFocusVisible: true,
                  color: "sky",
                  className: "ring-sky-500 ring-offset-slate-100",
                },
                {
                  isPressed: true,
                  disabled: false,
                  color: "slate",
                  className: [
                    `border-slate-600 bg-slate-800 sm:border-slate-500
                    sm:bg-slate-700`,
                  ],
                },
                {
                  isPressed: true,
                  disabled: false,
                  color: "sky",
                  className: "bg-sky-700 sm:bg-sky-600",
                },
                {
                  isPressed: false,
                  disabled: false,
                  color: "slate",
                  className: "sm:hover:border-slate-600 sm:hover:bg-slate-800",
                },
                {
                  isPressed: false,
                  disabled: false,
                  color: "sky",
                  className: "sm:hover:bg-sky-500",
                },
              ],
            },
          )({ color, disabled, isPressed, isFocusVisible }),
          className,
        )}
        type={Comp === "button" ? "button" : undefined}
        {...buttonProps}
        disabled={Comp === "button" ? disabled : undefined}
        ref={ref}
      >
        {asChild && disabled
          ? (Children.only(children) as ReactElement).props.children
          : children}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button };
