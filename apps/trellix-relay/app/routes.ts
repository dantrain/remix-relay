import type { RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const routes: RouteConfig = flatRoutes({
  ignoredRouteFiles: ["__generated__/*"],
});

export default routes;
