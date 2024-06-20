import { cx } from "class-variance-authority";
import { GripVerticalIcon } from "lucide-react";
import { HTMLAttributes, forwardRef, useEffect } from "react";
import { useFocusVisible } from "react-aria";

export type HandleProps = {
  dragOverlay?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const Handle = forwardRef<HTMLButtonElement, HandleProps>(
  ({ dragOverlay, ...rest }, ref) => {
    const { isFocusVisible } = useFocusVisible({ isTextInput: true });

    useEffect(() => {
      if (!dragOverlay || isFocusVisible) {
        return;
      }

      document.body.style.cursor = "grabbing";

      return () => {
        document.body.style.cursor = "";
      };
    }, [dragOverlay, isFocusVisible]);

    return (
      <button
        className={cx(
          `select-none rounded-md px-2 outline-none focus-visible:ring-2
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
