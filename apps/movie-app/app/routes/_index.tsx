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
    <main className="h-[100dvh] bg-blue-50 px-8 py-6">
      <h1 className="mb-4 text-3xl font-bold text-blue-950">
        Welcome to Remix
      </h1>
      <Button appName="Remix">Click me!</Button>
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
