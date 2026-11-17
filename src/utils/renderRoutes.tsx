import { PageLoading } from "@/components/shared/PageLoading";
import { Protected } from "@/components/shared/Protected";
import { Route } from "react-router-dom";

import type { RouteItem } from "@/constants/routes";

/**
 * Converts a nested RouteItem[] configuration into
 * React Router <Route /> components.
 *
 * This function is recursive, so it can handle
 * children at any nesting level.
 */
export function renderRoutes(items: RouteItem[]): React.ReactNode[] {
  return items.flatMap((item: RouteItem): React.ReactNode[] => {
    const routes: React.ReactNode[] = [];

    /*
     * Register the current item's route.
     *
     * A parent navigation item may not have a path
     * or element, so only create a <Route> when both exist.
     */
    if (item.path && item.element) {
      routes.push(
        <Route
          key={item.path}
          path={item.path}
          element={item.permission ? <Protected permission={item.permission}><PageLoading>{item.element}</PageLoading></Protected> : <PageLoading>{item.element}</PageLoading>}
        />,
      );
    }

    /*
     * If this item has children, recursively register
     * their routes as well.
     */
    if (item.children) {
      routes.push(...renderRoutes(item.children));
    }

    return routes;
  });
}
