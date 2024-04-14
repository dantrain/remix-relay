import { Suspense, useLoaderQuery } from "@remix-relay/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { graphql } from "react-relay";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";
import { DeferTest } from "~/components/DeferTest";

const query = graphql`
  query IndexQuery {
    hello
    ...DeferTestFragment @defer
  }
`;

export const meta: MetaFunction = () => {
  return [{ title: "Cloudflare Test" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) =>
  loaderQuery(context, query, {});

export default function Index() {
  const [data] = useLoaderQuery<IndexQuery>(query);

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
      <pre>{JSON.stringify(data.hello, null, 4)}</pre>
      <Suspense fallback="Am load...">
        <DeferTest dataRef={data} />
      </Suspense>
    </div>
  );
}
