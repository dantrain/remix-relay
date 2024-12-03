import { index, route, type RouteConfig } from "@react-router/dev/routes";

const routes = [
  index("./routes/Home.tsx"),
  route("board/:id", "./routes/Board.tsx"),
  route("signin", "./routes/SignIn.tsx"),
] satisfies RouteConfig;

export default routes;
