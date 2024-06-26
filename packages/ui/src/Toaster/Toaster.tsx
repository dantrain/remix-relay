import { cva, cx } from "class-variance-authority";
import { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = {
  variant?: "dark" | "light";
} & ComponentProps<typeof Sonner>;

export function Toaster({ variant = "dark", ...props }: ToasterProps) {
  return (
    <Sonner
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cva(
            `flex w-[var(--width)] items-center gap-2 rounded-md border px-6
            py-4`,
            {
              variants: {
                variant: {
                  dark: "border-slate-700 bg-slate-900",
                  light: "border-slate-300 bg-white text-slate-800 shadow-lg",
                },
              },
            },
          )({ variant }),
          title: cx("!leading-4"),
          closeButton: cva("!-right-4 !left-[unset]", {
            variants: {
              variant: {
                dark: `!border-slate-600 !bg-slate-800 !text-white
                hover:!border-slate-500 hover:!bg-slate-700`,
                light: "!bg-slate-600 !text-white hover:!bg-slate-500",
              },
            },
          })({ variant }),
        },
      }}
      {...props}
    />
  );
}
