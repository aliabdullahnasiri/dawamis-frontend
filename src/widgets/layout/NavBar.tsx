import { AppBar, Box, Breadcrumbs, Toolbar, Typography } from "@mui/material";

import { useMaterialController } from "@/context/useMaterialController";
import {
    MINI_DRAWER_WIDTH as MINI_SIDENAV_WIDTH,
    DRAWER_WIDTH as SIDENAV_WIDTH,
} from "@/widgets/layout/Sidenav";

export default function Navbar() {
  const [controller] = useMaterialController();

  const { isMini, fixedNavbar: fixed, openSidenav } = controller;

  return (
    <AppBar
      position={fixed ? "sticky" : "relative"}
      elevation={0}
      sx={{
        ...(fixed && {
          top: 16,
          left: {
            xs: 10,
            md: `${openSidenav ? (isMini ? MINI_SIDENAV_WIDTH : SIDENAV_WIDTH) + 40 : 20}px`,
          },
          right: {
            xs: 8,
            md: 20,
          },
          width: "auto",
          borderRadius: 1.25,

          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(20, 20, 25, 0.75)"
              : "rgba(255, 255, 255, 0.75)",

          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",

          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 30px rgba(0, 0, 0, 0.3)"
              : "0 8px 30px rgba(0, 0, 0, 0.08)",

          px: 2.2,
          py: 0,
        }),

        backgroundColor: "transparent",
        boxShadow: "none",
        color: "text.primary",
        transition: "margin,padding 300ms ease",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            md: 72,
          },
          padding: "0px !important",

          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
          }}
        >
          <Breadcrumbs
            separator="/"
            sx={{
              "& .MuiBreadcrumbs-separator": {
                color: "text.disabled",
                mx: 0.75,
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.disabled",
                fontSize: "0.875rem",
              }}
            >
              Dashboard
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontSize: "0.875rem",
              }}
            >
              Home
            </Typography>
          </Breadcrumbs>

          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Home
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
