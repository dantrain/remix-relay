import { cx } from "class-variance-authority";
import { GripVerticalIcon } from "lucide-react";
import { HTMLAttributes, forwardRef, useEffect } from "react";

export type HandleProps = {
  dragOverlay: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const Handle = forwardRef<HTMLButtonElement, HandleProps>(
  ({ dragOverlay, ...rest }, ref) => {
    useEffect(() => {
      if (!dragOverlay) {
        return;
      }

      document.body.style.cursor = "grabbing";

      return () => {
        document.body.style.cursor = "";
      };
    }, [dragOverlay]);

    return (
      <button
        className={cx(
          `rounded-md px-2 outline-none focus-visible:ring-2
          focus-visible:ring-sky-500 sm:px-1`,
          dragOverlay ? "cursor-[inherit]" : "cursor-grab",
        )}
        type="button"
        ref={ref}
        {...rest}
        aria-describedby={undefined}
      >
        <GripVerticalIcon className="w-4" />
      </button>
    );
  },
);

Handle.displayName = "Handle";
