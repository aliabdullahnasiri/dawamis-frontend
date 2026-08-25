import { Box, Button, Typography } from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";

import { setOpenConfigurator, setOpenSidenav } from "@/context/materialActions";
import { useMaterialController } from "@/context/useMaterialController";
import Configurator from "@/widgets/layout/Configurator.tsx";
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

          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
            lg: 3.5,
          },

          ml: {
            xs: 0,
            lg: openSidenav ? (isMini ? "84px" : "260px") : 0,
          },

          transition: "margin-left 0.3s ease",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1600px",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
              lineHeight: 1.7,
              overflowWrap: "break-word",
            }}
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id,
            numquam iste? Placeat culpa quam suscipit, dicta distinctio quas
            velit, facere in sunt asperiores voluptas impedit atque. Fuga veniam
            totam ipsa.
            <Button
              type="button"
              onClick={() => {
                setOpenSidenav(dispatch, !openSidenav);
              }}
            >
              Open Side Nav
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
