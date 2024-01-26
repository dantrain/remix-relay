import { createServerClient, parse } from "@supabase/ssr";
import type { Request, Response } from "express";
import { IncomingMessage } from "http";
import zlib from "zlib";
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
        const value =
          cookiesSetThisRequest[key] ??
          (req as Request)?.cookies?.[key] ??
          parse(req.headers.cookie ?? "")?.[key];

        if (!value) return "";

        const decodedValue =
          key.includes("auth-token") && !key.includes("verifier")
            ? zlib.gunzipSync(Buffer.from(value, "base64url")).toString("utf-8")
            : decodeURIComponent(value);

        return decodedValue;
      },
      set: writeCookies
        ? (key, value, options) => {
            if (!res || res.headersSent) {
              console.error("Failed to set cookie", key, {
                headersSent: res?.headersSent,
              });
              return;
            }

            const encodedValue =
              key.includes("auth-token") && !key.includes("verifier")
                ? zlib
                    .gzipSync(Buffer.from(value, "utf-8"))
                    .toString("base64url")
                : encodeURIComponent(value);

            res.cookie(key, encodedValue, {
              ...options,
              sameSite: "lax",
              httpOnly: true,
            });

            cookiesSetThisRequest[key] = encodedValue;
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
