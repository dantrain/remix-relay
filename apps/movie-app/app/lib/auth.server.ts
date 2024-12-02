import {
  AppLoadContext,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { z } from "zod";
import * as dbSchema from "~/schema/db-schema";
import { User, users } from "~/schema/types/User";
import exists from "./exists";

const envSchema = z.object({
  ROOT_URL: z.string().url(),
  COOKIE_SECRETS: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
});

function getEnv(context: AppLoadContext) {
  return envSchema.parse(
    process.env.NODE_ENV === "development"
      ? process.env
      : context.cloudflare.env,
  );
}

export function getSessionStorage(context: AppLoadContext) {
  const env = getEnv(context);

  return createCookieSessionStorage({
    cookie: {
      name: "_session", // use any name you want here
      sameSite: "lax", // this helps with CSRF
      path: "/", // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: env.COOKIE_SECRETS.split(","),
      secure: process.env.NODE_ENV === "production", // enable this in prod only
    },
  });
}

export function getAuthenticator(context: AppLoadContext) {
  const env = getEnv(context);

  const gitHubStrategy = new GitHubStrategy(
    {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      redirectURI: `${env.ROOT_URL}/auth/github/callback`,
      scopes: ["user:email"],
    },
    async ({ tokens }) => {
      const response = await fetch("https://api.github.com/user/emails", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${tokens.accessToken()}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const emails: [{ email?: string; primary: boolean }] =
        await response.json();

      console.log("profile", emails);

      const user = {
        email: exists(
          emails.filter((_) => _.primary)[0]?.email,
          "Missing user email",
        ),
      };

      const cloudflareEnv = exists(
        (context as AppLoadContext)?.cloudflare.env,
      ) as Env;

      const db = drizzle(cloudflareEnv.DB, {
        schema: dbSchema,
        casing: "snake_case",
      });

      await db
        .insert(users)
        .values(user)
        .onConflictDoNothing({ target: users.email });

      return user;
    },
  );

  const authenticator = new Authenticator<User>();

  authenticator.use(gitHubStrategy);

  return authenticator;
}

export async function authenticate(request: Request, context: AppLoadContext) {
  const session = await getSessionStorage(context).getSession(
    request.headers.get("cookie"),
  );

  const user = session.get("user");

  if (user) {
    return user;
  }

  const url = new URL(request.url);

  if (url.pathname !== "/signin") {
    throw redirect("/signin", {
      headers: {
        "Set-Cookie": await getSessionStorage(context).commitSession(session),
      },
    });
  }

  return null;
}
