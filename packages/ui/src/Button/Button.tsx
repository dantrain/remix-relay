import { Slot } from "@radix-ui/react-slot";
import { useObjectRef } from "@react-aria/utils";
import { cva } from "class-variance-authority";
import type { ReactElement, ReactNode } from "react";
import { Children, forwardRef } from "react";
import { AriaButtonOptions, useButton, useFocusVisible } from "react-aria";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
} & (({ asChild?: false } & AriaButtonOptions<"button">) | { asChild: true });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild, className, disabled = false, onClick, children, ...rest },
    forwardedRef,
  ) => {
    const ref = useObjectRef(forwardedRef);
    const Comp = asChild && !disabled ? Slot : "button";

    const { isFocusVisible } = useFocusVisible();

    const { buttonProps, isPressed } = useButton(
      { onPress: onClick, ...rest, isDisabled: disabled },
      ref,
    );

    return (
      <Comp
        className={twMerge(
          cva(
            `inline-block cursor-pointer select-none rounded-md border
            border-slate-700 bg-slate-900 px-2 py-1 text-left transition-colors
            focus:outline-none sm:transition-none`,
            {
              variants: {
                disabled: {
                  true: "cursor-not-allowed opacity-60",
                },
                isPressed: { true: "" },
                isFocusVisible: {
                  true: [
                    `ring-blue-400 ring-offset-4 ring-offset-slate-950
                    focus:ring-2`,
                  ],
                },
              },
              compoundVariants: [
                {
                  isPressed: true,
                  disabled: false,
                  className: [
                    `border-slate-600 bg-slate-800 sm:border-slate-500
                    sm:bg-slate-700`,
                  ],
                },
                {
                  isPressed: false,
                  disabled: false,
                  className: "sm:hover:border-slate-600 sm:hover:bg-slate-800",
                },
              ],
            },
          )({ disabled, isPressed, isFocusVisible }),
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
