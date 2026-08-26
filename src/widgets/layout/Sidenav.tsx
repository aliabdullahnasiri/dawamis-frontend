import { Box, Divider, Drawer, List, Typography } from "@mui/material";

import NavItem from "@/components/NavItem";
import { routes, type RouteItem } from "@/constants/routes";

import { useMaterialController } from "@/context/useMaterialController";

import logoDark from "@/assets/img/logo-ct-dark.png";
import logoLight from "@/assets/img/logo-ct.png";
import { setSidenavHovered } from "@/context/materialActions";
import { useSidenavTheme } from "@/context/useSidenavTheme";
import ProfileNav from "@/widgets/layout/ProfileNav";
import { useMemo, useState } from "react";

function findActiveParent(items: RouteItem[], pathname: string): string | null {
  for (const item of items) {
    if (
      item.children?.some(
        (child) =>
          child.path === pathname || pathname.startsWith(`${child.path}/`),
      )
    ) {
      return item.label;
    }

    if (item.children) {
      const nested = findActiveParent(item.children, pathname);

      if (nested) {
        return item.label;
      }
    }
  }

  return null;
}

const DRAWER_WIDTH = 250;
const MINI_DRAWER_WIDTH = 80;

const dashboardRoutes = routes.find((route) => route.layout === "dashboard");

const navigation = dashboardRoutes?.pages ?? [];

export default function Sidenav() {
  const [controller, dispatch] = useMaterialController();

  const { openSidenav, isMini, darkMode, sidenavColor } = controller;

  const activeParent = useMemo(
    () => findActiveParent(navigation, location.pathname),
    [],
  );

  const [openMenu, setOpenMenu] = useState<string | null>(activeParent);

  const handleMenuToggle = (label: string) => {
    setOpenMenu((previous) => (previous === label ? null : label));
  };

  const { theme: sideNavTheme, themeName } = useSidenavTheme();

  return (
    <Drawer
      variant="permanent"
      open
      onMouseEnter={() => setSidenavHovered(dispatch, true)}
      onMouseLeave={() => setSidenavHovered(dispatch, false)}
      sx={{
        width: isMini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
          boxSizing: "border-box",
          m: 2,
          borderRadius: "1rem",
          height: "calc(100% - 32px)",
          border: "none",
          boxShadow:
            themeName === "transparent"
              ? "none"
              : "0 4px 6px -1px rgba(0,0,0,.06), 0 2px 4px -1px rgba(0,0,0,.04)",
          transform: openSidenav ? "translateX(0)" : "translateX(-120%)",
          transition: "width 300ms ease, transform 300ms ease",
          overflowX: "hidden",
          backgroundColor: sideNavTheme.background,
          color: sideNavTheme.text,
        },
      }}
    >
      <Box
        sx={{
          px: isMini ? 2 : 3,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: isMini ? "center" : "flex-start",
          gap: 1.5,
          minHeight: 64,
          transition: "all 300ms ease",
        }}
      >
        <Box
          component="img"
          src={
            themeName === "white" || (!darkMode && themeName === "transparent")
              ? logoDark
              : logoLight
          }
          alt="DawaKhana"
          sx={{
            width: 32,
            height: 32,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        {!isMini && (
          <Box
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              DawaKhana
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Pharmacy Management
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 1, borderColor: sideNavTheme.divider }} />

      <ProfileNav
        full_name="Ali Abdullah Nasiri"
        email="nasiri.aliabdullah@gmail.com"
      />

      <Divider sx={{ mx: 2, mb: 1, borderColor: sideNavTheme.divider }} />

      <List sx={{ px: 0 }}>
        {navigation.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            sidenavColor={sidenavColor}
            isMini={isMini}
            openMenu={openMenu}
            onMenuToggle={handleMenuToggle}
          />
        ))}
      </List>
    </Drawer>
  );
}
