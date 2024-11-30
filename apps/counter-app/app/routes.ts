import { flatRoutes } from "@remix-run/fs-routes";
import type { RouteConfig } from "@remix-run/route-config";

const routes: RouteConfig = flatRoutes({
  ignoredRouteFiles: ["__generated__/*"],
});

export default routes;
