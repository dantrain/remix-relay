import { Link } from "@remix-run/react";
import { Button } from "@remix-relay/ui";
import { SignOutIcon } from "./Icons";

export default function Header() {
  return (
    <header
      className="flex items-center justify-between bg-slate-900 p-4 text-white
        sm:px-8 sm:py-6"
    >
      <Link
        className="rounded-sm ring-sky-500 ring-offset-4 ring-offset-slate-900
          focus:outline-none focus-visible:ring-2"
        to="/"
      >
        <h1 className="mb-0.5 text-2xl font-black leading-none">Trellix</h1>
        <p className="leading-none text-slate-500">a remix-relay demo</p>
      </Link>

      <Button asChild className="px-3">
        <a className="flex items-center gap-2" href="/auth/signout">
          <SignOutIcon />
          Sign out
        </a>
      </Button>
    </header>
  );
}
