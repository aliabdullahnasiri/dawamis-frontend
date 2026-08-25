import {
  Box,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

import { sidenavColorMap } from "@/constants/sidenav";

export interface NavItemProps {
  label: string;
  path?: string;
  icon: React.ElementType;
  permission?: string;
  children?: NavItemProps[];
}

interface Props extends NavItemProps {
  sidenavColor: string;
  isMini: boolean;
  depth?: number;
  openMenu: string | null;
  onMenuToggle: (label: string) => void;
}

function containsActivePath(items: NavItemProps[], pathname: string): boolean {
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

export default function NavItem({
  label,
  path,
  icon: Icon,
  children,
  sidenavColor,
  isMini,
  openMenu,
  onMenuToggle,
  depth = 0,
}: Props) {
  const location = useLocation();

  const sidenav = sidenavColorMap[sidenavColor] ?? sidenavColorMap.dark;

  const hasChildren = Boolean(children?.length);

  const isActive =
    path === location.pathname ||
    (!!path && location.pathname.startsWith(`${path}/`));

  const hasActiveChild = children?.length
    ? containsActivePath(children, location.pathname)
    : false;

  const active = isActive || hasActiveChild;

  const isOpen = openMenu === label ;

  const handleClick = () => {
    if (hasChildren && !isMini) {
      onMenuToggle(label);
    }
  };

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

            color: active ? sidenav.main : "text.secondary",

            backgroundColor: active ? `${sidenav.main}12` : "transparent",

            "&:hover": {
              backgroundColor: `${sidenav.main}10`,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 30,

              color: active ? sidenav.main : "text.secondary",
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

          color: active ? sidenav.contrast : "text.primary",

          background: active
            ? `linear-gradient(
                135deg,
                ${sidenav.main} 0%,
                ${sidenav.dark} 100%
              )`
            : "transparent",

          boxShadow: active ? `0 4px 12px ${sidenav.main}40` : "none",

          justifyContent: isMini ? "center" : "flex-start",

          transition:
            "background 250ms ease, color 200ms ease, box-shadow 250ms ease",

          "&:hover": {
            background: active
              ? `linear-gradient(
                  135deg,
                  ${sidenav.main},
                  ${sidenav.dark}
                )`
              : "action.hover",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isMini ? 0 : 34,

            color: active ? sidenav.contrast : "text.secondary",
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
