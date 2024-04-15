import { Suspense, useLoaderQuery } from "@remix-relay/react";
import { Spinner } from "@remix-relay/ui";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { graphql } from "react-relay";
import { DeferTest } from "~/components/DeferTest";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

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
    <div className="mx-10 my-8">
      <h1 className="mb-6 text-2xl font-bold">
        Welcome to Remix with Relay, Vite and Cloudflare
      </h1>
      <pre className="mb-4">{JSON.stringify(data.hello, null, 4)}</pre>
      <Suspense fallback={<Spinner className="max-w-80" />}>
        <DeferTest dataRef={data} />
      </Suspense>
    </div>
  );
}
