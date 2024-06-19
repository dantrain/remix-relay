import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Anchor({
  className,
  children,
  ...rest
}: ComponentProps<"a">) {
  return (
    <a
      className={twMerge(
        `rounded-sm underline underline-offset-2 ring-sky-500 ring-offset-2
        ring-offset-slate-900 focus:outline-none focus-visible:ring-2`,
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
