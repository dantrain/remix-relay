import type { MetaFunction } from "@remix-run/node";
import { Button } from "@repo/ui";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="px-8 py-6 bg-blue-50 h-[100dvh]">
      <h1 className="text-3xl font-bold mb-4 text-blue-950">
        Welcome to Remix
      </h1>
      <Button appName="docs">Click me!</Button>
      <ul className="mt-4 flex flex-col gap-4 text-blue-900">
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </main>
  );
}
