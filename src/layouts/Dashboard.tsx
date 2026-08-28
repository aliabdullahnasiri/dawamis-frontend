import { Box } from "@mui/material";
import { Routes } from "react-router-dom";

import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";

import { routes } from "@/constants/routes";
import { setOpenConfigurator, setOpenSidenav } from "@/context/materialActions";
import { useMaterialController } from "@/context/useMaterialController";
import { renderRoutes } from "@/utils/renderRoutes";
import Configurator from "@/widgets/layout/Configurator.tsx";
import Navbar from "@/widgets/layout/NavBar";
import Sidenav from "@/widgets/layout/Sidenav.tsx";

import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";

export function Dashboard() {
  const [controller, dispatch] = useMaterialController();

  const { openSidenav, isMini, fixedNavbar } = controller;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    setOpenSidenav(dispatch, !isMobile);
  }, [isMobile, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        transition: "background 500ms ease",
      }}
    >
      <Sidenav />

      <Configurator />

      <IconButton
        onClick={() => setOpenConfigurator(dispatch, true)}

        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 40,

          width: 48,
          height: 48,

          borderRadius: "50%",

          color: "white",
          bgcolor: "primary.main",

          boxShadow: 3,

          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <SettingsIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <Box
        sx={{
          minHeight: "100vh",
          boxSizing: "border-box",
          p: 2,
          pl: openSidenav ? 4.25 : 2,
          ml: {
            xs: 0,
            lg: openSidenav ? (isMini ? "84px" : "260px") : 0,
          },
          transition: "all 0.3s ease",
        }}
      >
        <Navbar />

        <Box
          sx={{
            mt: fixedNavbar ? 5 : 2.5,
            height: 1000,
            transition: "300ms ease",
          }}
        >
          <Routes>
            {routes.map(({ layout, pages }) =>
              layout === "dashboard" ? renderRoutes(pages) : null,
            )}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
