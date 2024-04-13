import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Suspense } from "~/components/Suspense";
import { graphql, useLazyLoadQuery } from "react-relay";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";
import { useLoaderData } from "@remix-run/react";

const query = graphql`
  query IndexQuery {
    hello
  }
`;

export const meta: MetaFunction = () => {
  return [{ title: "Cloudflare Test" }];
};

export const loader: LoaderFunction = () => {
  console.log("Loader");

  return json({ foo: "bar" });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix (with Vite and Cloudflare)</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <Suspense fallback="Am load...">
        <LazyLoadTest />
      </Suspense>
    </div>
  );
}

function LazyLoadTest() {
  const data = useLazyLoadQuery<IndexQuery>(query, {});

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
