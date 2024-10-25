import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { Request, Response } from "express";
import { IncomingMessage } from "http";
import { env } from "./env";

export function createSupabaseClient(
  req: Request | IncomingMessage,
  res: Response | null,
  { writeCookies }: { writeCookies: boolean } = { writeCookies: true },
) {
  const reqCookies = (req as Request)?.cookies
    ? Object.entries((req as Request)?.cookies).map(([name, value]) => ({
        name,
        value,
      }))
    : null;

  let cookiesSetThisRequest: { name: string; value: string }[] | undefined;

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        return (
          cookiesSetThisRequest ??
          reqCookies ??
          parseCookieHeader(req.headers.cookie ?? "")
        );
      },
      setAll: writeCookies
        ? (cookiesToSet) => {
            if (!res || res.headersSent) {
              console.error("Failed to set cookies", cookiesToSet, {
                headersSent: res?.headersSent,
              });
              return;
            }

            for (const { name, value, options } of cookiesToSet) {
              res.cookie(name, value, {
                ...options,
                sameSite: "lax",
                httpOnly: true,
                maxAge: options.maxAge ? 365 * 24 * 60 * 60 * 1000 : 0,
              });
            }

            cookiesSetThisRequest = cookiesToSet;
          }
        : () => {},
    },
  });

  // @ts-expect-error - suppressGetSessionWarning is not part of the official API
  supabase.auth.suppressGetSessionWarning = true;

  return supabase;
}
