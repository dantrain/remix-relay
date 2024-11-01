/* eslint-disable no-unused-vars */
import { Slot } from "@radix-ui/react-slot";
import { mergeProps, useObjectRef } from "@react-aria/utils";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { Children, forwardRef } from "react";
import {
  AriaButtonOptions,
  PressEvent,
  useButton,
  useFocusVisible,
} from "react-aria";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  className?: string;
  variant?: "slate" | "sky" | "outline" | "ghost";
  children: ReactNode;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onPress?: (e: PressEvent) => void;
  onClick?: (e: MouseEvent) => void;
  disableReactAria?: boolean;
} & (({ asChild?: false } & AriaButtonOptions<"button">) | { asChild: true });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      variant = "slate",
      disabled = false,
      onPress,
      onClick,
      type = "button",
      disableReactAria = false,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const ref = useObjectRef(forwardedRef);
    const Comp = asChild && !disabled ? Slot : "button";

    const { isFocusVisible } = useFocusVisible({ isTextInput: true });

    const { buttonProps, isPressed } = useButton(
      {
        onPress: (e) => {
          if (onPress) {
            return onPress(e);
          } else if (e.pointerType !== "mouse" && onClick) {
            return onClick(e as unknown as MouseEvent);
          }
        },
        isDisabled: disabled,
      },
      ref,
    );

    const props = disableReactAria
      ? mergeProps(rest, {
          onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            onClick?.(e as unknown as MouseEvent) ||
            onPress?.(e as unknown as PressEvent),
        })
      : mergeProps(
          rest,
          {
            onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              onClick?.(e as unknown as MouseEvent),
          },
          buttonProps,
        );

    return (
      <Comp
        className={twMerge(
          cva(
            `inline-block cursor-pointer select-none rounded-md px-2 py-1
            focus:outline-none max-sm:transition-colors`,
            {
              variants: {
                variant: {
                  slate: "border border-slate-700 bg-slate-900 text-white",
                  sky: "bg-[#0894d8] text-white",
                  outline: [
                    "text-slate-800 shadow-[inset_0_0_0_1px] shadow-slate-600",
                  ],
                  ghost: "",
                },
                disabled: {
                  true: "cursor-not-allowed opacity-60",
                },
                isPressed: { true: "" },
                isFocusVisible: {
                  true: "focus:ring-2",
                },
              },
              compoundVariants: [
                // Hovered
                {
                  isPressed: false,
                  disabled: false,
                  variant: "slate",
                  className: "sm:hover:border-slate-600 sm:hover:bg-slate-800",
                },
                {
                  isPressed: false,
                  disabled: false,
                  variant: "sky",
                  className: "sm:hover:bg-sky-500",
                },
                {
                  isPressed: false,
                  disabled: false,
                  variant: "outline",
                  className: "sm:hover:bg-slate-200",
                },
                {
                  isPressed: false,
                  disabled: false,
                  variant: "ghost",
                  className: "sm:hover:bg-[#d6dee8]",
                },
                // Pressed
                {
                  isPressed: true,
                  disabled: false,
                  variant: "slate",
                  className: [
                    `border-slate-600 bg-slate-800 sm:border-slate-500
                    sm:bg-slate-700`,
                  ],
                },
                {
                  isPressed: true,
                  disabled: false,
                  variant: "sky",
                  className: "bg-sky-700 sm:bg-sky-600",
                },
                {
                  isPressed: true,
                  disabled: false,
                  variant: "outline",
                  className: "bg-slate-200 sm:bg-[#d6dee8]",
                },
                {
                  isPressed: true,
                  disabled: false,
                  variant: "ghost",
                  className: "bg-[#d6dee8] sm:bg-slate-300",
                },
                // Focused
                {
                  isFocusVisible: true,
                  variant: "slate",
                  className:
                    "ring-blue-400 ring-offset-2 ring-offset-slate-950",
                },
                {
                  isFocusVisible: true,
                  variant: "sky",
                  className: "ring-sky-500 ring-offset-2 ring-offset-slate-200",
                },
                {
                  isFocusVisible: true,
                  variant: "outline",
                  className: "ring-sky-500 ring-offset-2 ring-offset-slate-200",
                },
                {
                  isFocusVisible: true,
                  variant: "ghost",
                  className: "ring-sky-500 ring-offset-slate-100",
                },
              ],
            },
          )({ variant, disabled, isPressed, isFocusVisible }),
          className,
        )}
        {...props}
        type={Comp === "button" ? type : undefined}
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
