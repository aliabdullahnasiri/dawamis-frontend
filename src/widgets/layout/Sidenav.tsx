import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import {
  ExpandLessRounded,
  ExpandMoreRounded,
  PersonRounded,
  ShieldOutlined,
} from "@mui/icons-material";

import { useSession } from "@/context/Session";
import { fullName, initials } from "@/components/auth/identity";
import { alpha } from "@mui/material/styles";
import { useLocale } from "@/i18n/locale";
import { useAuthText } from "@/components/auth/text";
import { NavLink, useLocation } from "react-router-dom";

import { routes, type RouteItem } from "@/constants/routes";

import { setSidenavHovered } from "@/context/materialActions";

import { useMaterialController } from "@/context/useMaterialController";

import { useSidenavTheme } from "@/context/useSidenavTheme";

import { sidenavColorMap } from "@/constants/sidenav";

import logoDark from "@/assets/img/logo-ct-dark.png";
import logoLight from "@/assets/img/logo-ct.png";

/* =========================================================
   TYPES
   ========================================================= */

interface NavItemProps extends RouteItem {
  sidenavColor: string;
  isMini: boolean;
  depth?: number;
  openMenu: string | null;
  onMenuToggle: (label: string) => void;
}

interface ProfileNavProps {
  full_name: string;
  email: string;
  avatar?: string;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

export const DRAWER_WIDTH = 250;
export const MINI_DRAWER_WIDTH = 80;

const dashboardRoutes = routes.find((route) => route.layout === "dashboard");

const navigation = dashboardRoutes?.pages ?? [];

/* =========================================================
   HELPERS
   ========================================================= */

function containsActivePath(items: RouteItem[], pathname: string): boolean {
  return items.some((item) => {
    if (item.path === pathname) {
      return true;
    }

    if (item.children) {
      return containsActivePath(item.children, pathname);
    }

    return false;
  });
}

function findActiveParent(items: RouteItem[], pathname: string): string | null {
  for (const item of items) {
    if (
      item.children?.some(
        (child) =>
          child.path === pathname ||
          (!!child.path && pathname.startsWith(`${child.path}/`)),
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

/* =========================================================
   PROFILE NAV
   ========================================================= */

function ProfileNav({ full_name, email, avatar }: ProfileNavProps) {
  const t = useAuthText();
  const location = useLocation();
  const [open, setOpen] = useState(location.pathname === "/account/security" || location.pathname === "/profile");

  const [controller] = useMaterialController();

  const { isMini, sidenavColor } = controller;

  const { theme: sideNavTheme } = useSidenavTheme();

  const sidenav = sidenavColorMap[sidenavColor] ?? sidenavColorMap.dark;

  const isSecurityActive = location.pathname === "/account/security";

  const isProfileActive = location.pathname === "/profile";

  return (
    <Box>
      {/* =========================
          PROFILE HEADER
          ========================= */}

      <ListItemButton
        aria-expanded={open}
        aria-label={full_name}
        onClick={() => setOpen((previous) => !previous)}
        sx={{
          mx: 1,
          my: 0.5,
          mt: 0,
          mb: 1,

          borderRadius: "0.75rem",

          py: 1,

          color: sideNavTheme.text,

          "&:hover": {
            backgroundColor: `${sidenav.main}10`,
          },
        }}
      >
        <Avatar
          src={avatar}
          alt={full_name}
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            fontSize: 13,
            fontWeight: 600,
            bgcolor: theme => alpha(theme.palette.primary.main, .12),
            color: 'primary.main',
            border: '1px solid',
            borderColor: theme => alpha(theme.palette.primary.main, .18),
          }}
        >{initials(full_name)}</Avatar>

        {!isMini && (
          <>
            <ListItemText
              primary={full_name}
              secondary={email}
              sx={{
                ml: 1.5,

                "& .MuiListItemText-primary": {
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: sideNavTheme.text,
                },

                "& .MuiListItemText-secondary": {
                  fontSize: "0.7rem",
                  color: sideNavTheme.textSecondary,
                },

                overflow: "hidden",
                whiteSpace: "nowrap",

                width: "100%",

                transition: "width 0.3s ease",
              }}
            />

            {open ? (
              <ExpandLessRounded
                fontSize="small"
                sx={{
                  color: sideNavTheme.textSecondary,
                }}
              />
            ) : (
              <ExpandMoreRounded
                fontSize="small"
                sx={{
                  color: sideNavTheme.textSecondary,
                }}
              />
            )}
          </>
        )}
      </ListItemButton>

      {/* =========================
          PROFILE MENU
          ========================= */}

      <Collapse in={!isMini && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* PROFILE */}

          <ListItemButton
            component={NavLink}
            to="/profile"
            sx={{
              mx: 2,
              ml: 4,
              my: 0.25,

              borderRadius: "0.75rem",

              py: 0.75,

              color: isProfileActive
                ? sideNavTheme.text
                : sideNavTheme.textSecondary,

              backgroundColor: isProfileActive
                ? `${sidenav.main}12`
                : "transparent",

              "&:hover": {
                backgroundColor: `${sidenav.main}10`,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 30,

                color: "inherit",
              }}
            >
              <PersonRounded fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary={t("profile")}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "0.8125rem",

                  fontWeight: isProfileActive ? 600 : 500,
                },
              }}
            />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/account/security"
            sx={{
              mx: 2, ml: 4, my: 0.25, py: 0.75, minHeight: 44,
              borderRadius: '0.75rem',
              color: isSecurityActive ? sideNavTheme.text : sideNavTheme.textSecondary,
              backgroundColor: isSecurityActive ? `${sidenav.main}12` : 'transparent',
              '&:hover': { backgroundColor: `${sidenav.main}10` },
            }}
          >
            <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
              <ShieldOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('security')} sx={{ '& .MuiListItemText-primary': {
              fontSize: '0.8125rem', fontWeight: isSecurityActive ? 600 : 500,
            } }} />
          </ListItemButton>

        </List>
      </Collapse>
    </Box>
  );
}

/* =========================================================
   NAV ITEM
   ========================================================= */

function NavItem({
  label,
  path,
  icon: Icon,
  children,
  sidenavColor,
  isMini,
  openMenu,
  onMenuToggle,
  depth = 0,
}: NavItemProps) {
  const location = useLocation();

  const { theme: sideNavTheme } = useSidenavTheme();

  const sidenav = sidenavColorMap[sidenavColor] ?? sidenavColorMap.dark;

  const hasChildren = Boolean(children?.length);

  const isActive =
    path === location.pathname || (!!path && location.pathname === path);

  const hasActiveChild = children?.length
    ? containsActivePath(children, location.pathname)
    : false;

  const active = isActive || hasActiveChild;

  /*
   * Only one menu can be open.
   *
   * If this item's label equals openMenu,
   * this menu is open.
   */
  const isOpen = openMenu === label;

  const handleClick = () => {
    if (hasChildren && !isMini) {
      onMenuToggle(label);
    }
  };

  /* =======================================================
     CHILD ITEM
     ======================================================= */

  if (depth > 0) {
    return (
      <Box>
        <ListItemButton
          component={path ? NavLink : "div"}
          to={path}
          onClick={handleClick}
          sx={{
            mx: 2,

            ml: 4 + (depth - 1) * 2,

            my: 0.25,

            borderRadius: "0.65rem",

            py: 0.75,

            color: active ? sideNavTheme.text : sideNavTheme.textSecondary,

            backgroundColor: active ? `${sidenav.main}25` : "transparent",

            "&:hover": {
              backgroundColor: `${sidenav.main}10`,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 30,

              color: "inherit",
            }}
          >
            <Icon fontSize="small" />
          </ListItemIcon>

          {!isMini && (
            <>
              <ListItemText
                primary={label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.8125rem",

                    fontWeight: active ? 600 : 500,
                  },
                }}
              />

              {hasChildren &&
                (isOpen ? (
                  <ExpandLessRounded fontSize="small" />
                ) : (
                  <ExpandMoreRounded fontSize="small" />
                ))}
            </>
          )}
        </ListItemButton>

        {/* CHILDREN OF CHILD */}

        {hasChildren && (
          <Collapse in={!isMini && isOpen} timeout={200} unmountOnExit>
            <Box>
              {children?.map((child) => (
                <NavItem
                  key={`${label}-${child.label}`}
                  {...child}
                  sidenavColor={sidenavColor}
                  isMini={isMini}
                  openMenu={openMenu}
                  onMenuToggle={onMenuToggle}
                  depth={depth + 1}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  }

  /* =======================================================
     PARENT / NORMAL ITEM
     ======================================================= */

  return (
    <Box>
      <ListItemButton
        component={path ? NavLink : "div"}
        to={path}
        onClick={handleClick}
        sx={{
          mx: 1.6,
          my: 0.5,

          borderRadius: "0.75rem",

          py: 1,

          color: active ? sidenav.contrast : sideNavTheme.text,

          backgroundColor: active ? sidenav.main : "transparent",
          boxShadow: "none",

          justifyContent: isMini ? "center" : "flex-start",

          transition: "background-color 150ms ease, color 150ms ease",
          "&:hover": { backgroundColor: active ? sidenav.dark : `${sidenav.main}10` },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isMini ? 0 : 34,

            color: active ? sidenav.contrast : sideNavTheme.textSecondary,
          }}
        >
          <Icon fontSize="small" />
        </ListItemIcon>

        {!isMini && (
          <>
            <ListItemText
              primary={label}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "0.875rem",

                  fontWeight: active ? 600 : 500,

                  color: "inherit",
                },
              }}
            />

            {hasChildren &&
              (isOpen ? (
                <ExpandLessRounded fontSize="small" />
              ) : (
                <ExpandMoreRounded fontSize="small" />
              ))}
          </>
        )}
      </ListItemButton>

      {/* CHILDREN */}

      {hasChildren && (
        <Collapse in={!isMini && isOpen} timeout={200} unmountOnExit>
          <Box>
            {children?.map((child) => (
              <NavItem
                key={`${label}-${child.label}`}
                {...child}
                sidenavColor={sidenavColor}
                isMini={isMini}
                openMenu={openMenu}
                onMenuToggle={onMenuToggle}
                depth={1}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

/* =========================================================
   SIDENAV
   ========================================================= */

export default function Sidenav() {
  const { t } = useLocale();
  const { user } = useSession();
  const [controller, dispatch] = useMaterialController();

  const { openSidenav, isMini, darkMode, sidenavColor } = controller;

  const location = useLocation();

  const { theme: sideNavTheme, themeName } = useSidenavTheme();

  /*
   * Find the parent of the
   * currently active route.
   */
  const activeParent = useMemo(
    () => findActiveParent(navigation, location.pathname),
    [location.pathname],
  );

  /*
   * Only one menu can be
   * opened at a time.
   */
  const [openMenu, setOpenMenu] = useState<string | null>(activeParent);

  /*
   * Toggle parent menu.
   */
  const handleMenuToggle = (label: string) => {
    setOpenMenu((previous) => (previous === label ? null : label));
  };

  return (<>
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

          transition: "width 220ms cubic-bezier(.2, 0, 0, 1), transform 220ms cubic-bezier(.2, 0, 0, 1)",

          overflowX: "hidden",

          backgroundColor: sideNavTheme.background,

          color: sideNavTheme.text,
        },
      }}
    >
      {/* =================================================
          BRAND
          ================================================= */}

      <Box
        sx={{
          px: isMini ? 2 : 3,

          py: 3,

          display: "flex",

          alignItems: "center",

          justifyContent: isMini ? "center" : "flex-start",

          gap: 1,

          minHeight: 64,

          transition: "padding 220ms ease, gap 220ms ease",
        }}
      >
        <Box
          component="img"
          src={
            themeName === "white" || (!darkMode && themeName === "transparent")
              ? logoDark
              : logoLight
          }
          alt="EMS"
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
              minWidth: 0,
              flex: 1,
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,

                lineHeight: 1.2,

                color: sideNavTheme.text,
              }}
            >
              EMS
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                lineHeight: 1.2,
                mt: 0.25,
                color: sideNavTheme.textSecondary,
              }}
            >
              Exchange Management
            </Typography>
          </Box>
        )}
      </Box>

      {/* =================================================
          DIVIDER
          ================================================= */}

      <Divider
        sx={{
          mx: 2,
          mb: 1,

          borderColor: sideNavTheme.divider,
        }}
      />

      {/* =================================================
          PROFILE
          ================================================= */}

      <ProfileNav
        full_name={fullName(user)}
        email={user?.email || ""}
      />

      {/* =================================================
          DIVIDER
          ================================================= */}

      <Divider
        sx={{
          mx: 2,
          mb: 1,

          borderColor: sideNavTheme.divider,
        }}
      />

      {/* =================================================
          NAVIGATION
          ================================================= */}

      <List
        sx={{
          px: 0,
        }}
      >
        {navigation.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            label={item.path === "/dashboard" ? t("dashboard") : item.label}
            sidenavColor={sidenavColor}
            isMini={isMini}
            openMenu={openMenu}
            onMenuToggle={handleMenuToggle}
          />
        ))}
      </List>
    </Drawer></>
  );
}
