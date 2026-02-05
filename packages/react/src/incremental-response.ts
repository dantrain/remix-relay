import type { GraphQLResponse } from "relay-runtime";

interface PendingResult {
  id: string;
  path: ReadonlyArray<string | number>;
  label?: string;
}

interface IncrementalResult {
  id: string;
  data?: Record<string, unknown>;
  items?: unknown[];
  subPath?: ReadonlyArray<string | number>;
  errors?: unknown[];
}

export interface IncrementalResponse {
  data?: Record<string, unknown>;
  pending?: PendingResult[];
  incremental?: IncrementalResult[];
  completed?: { id: string }[];
  hasNext?: boolean;
  errors?: { message: string }[];
  path?: ReadonlyArray<string | number>;
  label?: string;
}

function getAtPath(
  data: Record<string, unknown>,
  path: ReadonlyArray<string | number>,
): Record<string, unknown> | undefined {
  let current: unknown = data;
  for (const key of path) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current as Record<string, unknown> | undefined;
}

function checkErrors(body: IncrementalResponse) {
  const firstError = body.errors?.[0];
  if (firstError) {
    throw new Error(firstError.message);
  }
}

export async function* processMultipartResponse(
  parts: AsyncIterable<{ body: unknown; json?: boolean }> | Response,
): AsyncGenerator<GraphQLResponse> {
  // Handle non-multipart Response
  if (parts && typeof (parts as Response).json === "function") {
    const body = (await (parts as Response).json()) as IncrementalResponse;
    checkErrors(body);
    yield body as GraphQLResponse;
    return;
  }

  const pendingById = new Map<string, PendingResult>();
  let initialData: Record<string, unknown> | undefined;

  for await (const part of parts as AsyncIterable<{
    body: unknown;
    json?: boolean;
  }>) {
    const body = (
      part.json !== false ? part.body : JSON.parse(part.body as string)
    ) as IncrementalResponse;

    checkErrors(body);

    if (body.pending) {
      for (const pending of body.pending) {
        pendingById.set(pending.id, pending);
      }
    }

    if (body.incremental && body.incremental.length > 0) {
      for (const inc of body.incremental) {
        // Support old format (path on inc) and new format (id lookup)
        type OldFormatInc = IncrementalResult & {
          path?: ReadonlyArray<string | number>;
          label?: string;
        };
        const oldInc = inc as OldFormatInc;

        let fullPath: ReadonlyArray<string | number>;
        let label: string | undefined;

        if (oldInc.path !== undefined) {
          fullPath = oldInc.path;
          label = oldInc.label;
        } else {
          const pending = pendingById.get(inc.id);
          fullPath = [...(pending?.path ?? []), ...(inc.subPath ?? [])];
          label = pending?.label;
        }

        let mergedData = inc.data;
        if (initialData && inc.data) {
          const parentData = getAtPath(initialData, fullPath);
          if (parentData?.id !== undefined && !("id" in inc.data)) {
            mergedData = { id: parentData.id, ...inc.data };
          }
        }

        yield {
          data: mergedData,
          path: [...fullPath],
          label,
          hasNext: body.hasNext,
        } as GraphQLResponse;
      }
    } else if (body.data !== undefined) {
      initialData = body.data;
      yield body as GraphQLResponse;
    } else if (body.path !== undefined) {
      yield body as GraphQLResponse;
    }
  }
}
