import {
  Avatar,
  Collapse,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

import {
  ExpandLessRounded,
  ExpandMoreRounded,
  LogoutRounded,
  PersonRounded,
} from "@mui/icons-material";

import { Link as RouterLink, useLocation } from "react-router-dom";

import { useMaterialController } from "@/context/useMaterialController";
import { sidenavColorMap } from "@/constants/sidenav";
import { useSidenavTheme } from "@/context/useSidenavTheme";

interface ProfileNavProps {
  full_name: string;
  email: string;
  avatar?: string;
}

export default function ProfileNav({
  full_name,
  email,
  avatar,
}: ProfileNavProps) {
  const [open, setOpen] = useState(false);

  const [controller] = useMaterialController();
  const { theme: sideNavTheme } = useSidenavTheme();

  const { isMini, sidenavColor } = controller;

  const sidenav = sidenavColorMap[sidenavColor] ?? sidenavColorMap.dark;

  const location = useLocation();

  const isProfileActive = location.pathname == "/profile";

  return (
    <Box>
      <ListItemButton
        onClick={() => setOpen((prev) => !prev)}
        color={sideNavTheme.text}
        sx={{
          mx: 1,
          my: 0.5,
          mt: 0,
          mb: 1,
          borderRadius: "0.75rem",
          py: 1,
        }}
      >
        <Avatar
          src={avatar}
          alt={full_name}
          sx={{
            width: 28,
            height: 28,
            mr: 0,
          }}
        />

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
                },

                "& .MuiListItemText-secondary": {
                  fontSize: "0.7rem",
                },
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: isMini ? 0 : "100%",
                transition: "width 0.3s ease",
              }}
            />

            {open ? (
              <ExpandLessRounded fontSize="small" />
            ) : (
              <ExpandMoreRounded fontSize="small" />
            )}
          </>
        )}
      </ListItemButton>

      <Collapse in={!isMini && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Profile */}
          <ListItemButton
            component={RouterLink}
            to="/profile"
            sx={{
              mx: 2,
              ml: 4,
              my: 0.25,
              borderRadius: "0.75rem",
              py: 0.75,
              color: isProfileActive ? sidenav.main : "text.secondary",
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
              primary="My Profile"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "0.8125rem",
                  fontWeight: isProfileActive ? 600 : 500,
                },
              }}
            />
          </ListItemButton>

          {/* Logout */}
          <ListItemButton
            component={RouterLink}
            to="/logout"
            sx={{
              mx: 2,
              ml: 4,
              my: 0.25,
              borderRadius: "0.75rem",
              py: 0.75,
              color: "text.secondary",
              backgroundColor: "transparent",
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
              <LogoutRounded fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "0.8125rem",
                  fontWeight: isProfileActive ? 600 : 500,
                },
              }}
            />
          </ListItemButton>
        </List>
      </Collapse>
    </Box>
  );
}
