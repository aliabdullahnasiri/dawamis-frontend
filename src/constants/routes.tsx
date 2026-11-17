import { DashboardRounded } from "@mui/icons-material";

import { ShellHome } from "../components/shared/ShellHome";

export interface RouteItem {
  label: string;
  path?: string;
  icon: React.ElementType;
  permission?: string;
  children?: RouteItem[];
  element?: React.ReactNode;
}

export interface RouteGroup {
  title?: string;
  layout: "dashboard" | "auth";
  pages: RouteItem[];
}

export const routes: RouteGroup[] = [{ layout: "dashboard", pages: [{ label: "Dashboard", path: "/dashboard", icon: DashboardRounded, element: <ShellHome /> }] }];
export default routes;
