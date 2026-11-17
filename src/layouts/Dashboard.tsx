import { Box } from "@mui/material";
import { Routes } from "react-router-dom";


import { routes } from "@/constants/routes";
import { setOpenSidenav } from "@/context/materialActions";
import { useMaterialController } from "@/context/useMaterialController";
import { renderRoutes } from "@/utils/renderRoutes";
import Configurator from "@/widgets/layout/Configurator.tsx";
import Navbar from "@/widgets/layout/NavBar";
import Sidenav from "@/widgets/layout/Sidenav.tsx";

import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";

export function Dashboard() {
  const [controller, dispatch] = useMaterialController();

  const { openSidenav, isMini } = controller;

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
      }}
    >
      <Sidenav />

      <Configurator />



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
          transition: "margin 200ms ease, padding 200ms ease",
        }}
      >
        <Navbar />

        <Box
          sx={{
            mt: 3,
            minHeight: "70vh",
            transition: "margin 200ms ease",
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
