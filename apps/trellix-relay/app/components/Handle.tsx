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
        <svg viewBox="0 0 20 20" width="12">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>
    );
  },
);

Handle.displayName = "Handle";
