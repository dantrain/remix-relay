import { NavLink } from "react-router";
import { Button, Spinner } from "@remix-relay/ui";

export default function BackLink() {
  return (
    <Button
      className="inline-block text-2xl [&.pending]:scale-[.99]
        [&.pending]:border-slate-600 [&.pending]:bg-slate-800"
      asChild
    >
      <NavLink relative="path" title="Home" to="../.." prefetch="render">
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
