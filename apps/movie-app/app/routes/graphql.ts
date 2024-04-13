import type { HTTPGraphQLRequest } from "@apollo/server";
import { HeaderMap } from "@apollo/server";
import { type ActionFunctionArgs } from "@remix-run/node";
import { ReadableStream } from "node:stream/web";
import { getServer } from "~/lib/apollo-server";

export async function action({ request }: ActionFunctionArgs) {
  const server = await getServer();

  const headers = new HeaderMap();

  for (const [key, value] of request.headers.entries()) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  const httpGraphQLRequest: HTTPGraphQLRequest = {
    method: request.method.toUpperCase(),
    headers,
    body: await request.json(),
    search: new URL(request.url).searchParams.toString(),
  };

  const result = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest,
    context: async () => ({}),
  });

  const responseHeaders = Object.fromEntries(result.headers.entries());

  if (result.body.kind === "complete") {
    return new Response(result.body.string, { headers: responseHeaders });
  }

  const stream = ReadableStream.from(result.body.asyncIterator);

  // @ts-expect-error Because
  return new Response(stream, {
    headers: responseHeaders,
  });
}
