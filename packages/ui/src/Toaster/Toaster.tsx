import { cx } from "class-variance-authority";
import { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cx(
            "flex w-[var(--width)] items-center gap-2 rounded-md",
            "border border-slate-700 bg-slate-900 px-6 py-4",
          ),
          title: cx("!leading-4"),
          closeButton: cx(
            "!-right-4 !left-[unset] !text-white",
            "!border-slate-600 !bg-slate-800",
            "hover:!border-slate-500 hover:!bg-slate-700",
          ),
        },
      }}
      {...props}
    />
  );
}
