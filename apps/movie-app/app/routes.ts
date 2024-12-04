import {
  index,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("signin", "./routes/signin.tsx"),

  route("movie/:slug", "./routes/movie.$slug.tsx"),

  route("graphql", "./routes/graphql.ts"),

  ...prefix("auth/github", [
    index("./routes/auth.github.tsx"),
    route("callback", "./routes/auth.github.callback.tsx"),
  ]),
] satisfies RouteConfig;
