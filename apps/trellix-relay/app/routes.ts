import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("signin", "./routes/SignIn.tsx"),

  layout("./layouts/SignedIn.tsx", [
    index("./routes/Home.tsx"),
    route("board/:id", "./routes/Board.tsx"),
  ]),
] satisfies RouteConfig;
