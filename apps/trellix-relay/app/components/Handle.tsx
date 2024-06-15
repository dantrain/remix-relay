import { GripVerticalIcon } from "lucide-react";
import { HTMLAttributes, forwardRef } from "react";

export type HandleProps = HTMLAttributes<HTMLButtonElement>;

export const Handle = forwardRef<HTMLButtonElement, HandleProps>(
  (props, ref) => {
    return (
      <button
        className="cursor-grab rounded-md px-2 outline-none focus-visible:ring-2
          focus-visible:ring-sky-500 sm:px-1"
        type="button"
        ref={ref}
        {...props}
        aria-describedby={undefined}
      >
        <GripVerticalIcon className="w-4" />
      </button>
    );
  },
);

Handle.displayName = "Handle";
