import { NavLink } from "react-router";
import { Button, Spinner } from "@remix-relay/ui";

export default function BackLink() {
  return (
    <Button asChild>
      <NavLink
        className="inline-block text-2xl [&.pending]:scale-[.99]
          [&.pending]:border-slate-600 [&.pending]:bg-slate-800"
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
