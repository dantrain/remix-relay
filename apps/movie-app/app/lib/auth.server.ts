import {
  AppLoadContext,
  createCookieSessionStorage,
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

export function getAuthenticator(context: AppLoadContext) {
  const env = envSchema.parse(
    process.env.NODE_ENV === "development"
      ? process.env
      : context.cloudflare.env,
  );

  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session", // use any name you want here
      sameSite: "lax", // this helps with CSRF
      path: "/", // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: env.COOKIE_SECRETS.split(","),
      secure: process.env.NODE_ENV === "production", // enable this in prod only
    },
  });

  const gitHubStrategy = new GitHubStrategy(
    {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      redirectURI: `${env.ROOT_URL}/auth/github/callback`,
    },
    async ({ profile, context }) => {
      const user = {
        email: exists(profile.emails?.[0]?.value, "Missing user email"),
      };

      const env = exists((context as AppLoadContext)?.cloudflare.env) as Env;
      const db = drizzle(env.DB, { schema: dbSchema, casing: "snake_case" });

      await db
        .insert(users)
        .values(user)
        .onConflictDoNothing({ target: users.email });

      return user;
    },
  );

  const authenticator = new Authenticator<User>(sessionStorage);

  authenticator.use(gitHubStrategy);

  return authenticator;
}
