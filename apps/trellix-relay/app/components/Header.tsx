import { LogOutIcon } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "@remix-relay/ui";
import { GitHubIcon } from "./Icons";

export default function Header() {
  return (
    <header
      className="flex items-center justify-between bg-slate-900 p-4 text-white
        sm:px-8 sm:py-6"
    >
      <NavLink
        className="rounded-sm ring-sky-500 ring-offset-4 ring-offset-slate-900
          focus:outline-none focus-visible:ring-2 [&.pending]:opacity-60"
        to="/"
        prefetch="render"
        title="Home"
      >
        <h1 className="mb-0.5 text-2xl font-black leading-none">Trellix</h1>
        <p className="leading-none text-slate-500">a remix-relay demo</p>
      </NavLink>

      <div className="flex gap-3">
        <Button asChild className="relative py-2">
          <a href="https://github.com/dantrain/remix-relay" title="GitHub repo">
            <GitHubIcon className="w-4" />
            <span className="sr-only">GitHub repo</span>
          </a>
        </Button>
        <Button className="flex items-center gap-2 px-3" asChild>
          <a href="/auth/signout">
            <LogOutIcon className="w-4" />
            Sign out
          </a>
        </Button>
      </div>
    </header>
  );
}
