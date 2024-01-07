import { Button, Spinner } from "@remix-relay/ui";
import { NavLink } from "@remix-run/react";
import { cx } from "class-variance-authority";

export default function BackLink() {
  return (
    <Button asChild>
      <NavLink
        className={cx(
          "inline-block text-2xl",
          "[&.pending]:border-slate-600 [&.pending]:bg-slate-800",
          "[&.pending]:scale-[.99]",
        )}
        relative="path"
        title="Home"
        to="../.."
      >
        {({ isPending }) =>
          isPending ? (
            <Spinner />
          ) : (
            <>
              👈<span className="sr-only"> Home</span>
            </>
          )
        }
      </NavLink>
    </Button>
  );
}
