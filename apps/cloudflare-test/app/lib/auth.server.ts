import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import * as dbSchema from "~/schema/db-schema";
import { User, users } from "~/schema/types/User";
import { env } from "./env.server";
import exists from "./exists";

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
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `${env.ROOT_URL}/auth/github/callback`,
  },
  async ({ profile, context }) => {
    const user = {
      email: exists(profile.emails?.[0]?.value, "Missing user email"),
    };

    const env = exists(context?.cloudflare.env) as Env;
    const db = drizzle(env.DB, { schema: dbSchema });

    await db
      .insert(users)
      .values(user)
      .onConflictDoNothing({ target: users.email });

    return user;
  },
);

const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(gitHubStrategy);

export { authenticator };
