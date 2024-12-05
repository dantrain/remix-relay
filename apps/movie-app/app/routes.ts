import {
  index,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("./routes/Home.tsx"),
  route("signin", "./routes/SignIn.tsx"),

  route("movie/:slug", "./routes/Movie.tsx"),

  route("graphql", "./routes/Graphql.ts"),

  ...prefix("auth/github", [
    index("./routes/Auth.tsx"),
    route("callback", "./routes/AuthCallback.tsx"),
  ]),
] satisfies RouteConfig;
