import type { MetaFunction } from "@remix-run/cloudflare";
import { Suspense } from "~/components/Suspense";
import { graphql, useLazyLoadQuery } from "react-relay";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    hello
  }
`;

export const meta: MetaFunction = () => {
  return [{ title: "Cloudflare Test" }];
};

export default function Index() {
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
