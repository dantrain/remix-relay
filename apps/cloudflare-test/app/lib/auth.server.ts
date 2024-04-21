import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { env } from "./env.server";
import exists from "./exists";

type User = {
  email: string;
  image?: string;
};

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
  async ({ profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    // return User.findOrCreate({ email: profile.emails[0].value });
    return {
      email: exists(profile.emails?.[0]?.value, "Missing user email"),
      image: profile.photos?.[0]?.value,
    };
  },
);

const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(gitHubStrategy);

export { authenticator };
