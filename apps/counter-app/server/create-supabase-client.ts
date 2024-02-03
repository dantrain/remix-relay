import { createServerClient, parse } from "@supabase/ssr";
import type { Request, Response } from "express";
import { IncomingMessage } from "http";
import { env } from "./env";

export function createSupabaseClient(
  req: Request | IncomingMessage,
  res: Response | null,
  { writeCookies }: { writeCookies: boolean } = { writeCookies: true },
) {
  const cookiesSetThisRequest: Record<string, string> = {};

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        return (
          cookiesSetThisRequest[key] ??
          (req as Request)?.cookies?.[key] ??
          parse(req.headers.cookie ?? "")?.[key] ??
          ""
        );
      },
      set: writeCookies
        ? (key, value, options) => {
            if (!res || res.headersSent) {
              console.error("Failed to set cookie", key, {
                headersSent: res?.headersSent,
              });
              return;
            }

            res.cookie(key, value, {
              ...options,
              sameSite: "lax",
              httpOnly: true,
            });

            cookiesSetThisRequest[key] = value;
          }
        : () => {},
      remove: writeCookies
        ? (key, options) => {
            if (!res || res.headersSent) {
              console.error("Failed to remove cookie", key, {
                headersSent: res?.headersSent,
              });
              return;
            }

            res.cookie(key, "", { ...options, httpOnly: true });
          }
        : () => {},
    },
  });

  return supabase;
}
