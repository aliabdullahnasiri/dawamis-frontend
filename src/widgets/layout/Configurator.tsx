import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import {
  setDarkMode,
  setFixedNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setSidenavColor,
  setSidenavTheme,
} from "@/context/materialActions";
import { useMaterialController } from "@/context/useMaterialController";

import { sidenavColorMap } from "@/constants/sidenav";

export default function Configurator() {
  const [controller, dispatch] = useMaterialController();

  const {
    openConfigurator,
    sidenavColor,
    sidenavTheme,
    fixedNavbar,
    darkMode,
    miniSidenav,
  } = controller;

  return (
    <Drawer
      anchor="right"
      open={openConfigurator}
      onClose={() => setOpenConfigurator(dispatch, false)}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 380,
            },
            borderRadius: 0,
            p: 3,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ fontWeight: "bold" }}
          >
            DawaKhana Settings
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Customize your pharmacy dashboard.
          </Typography>
        </Box>

        <IconButton onClick={() => setOpenConfigurator(dispatch, false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Theme */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          color="text.primary"
          gutterBottom
          sx={{
            fontWeight: "bold",
          }}
        >
          Appearance
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 2,
          }}
        >
          <Box>
            <Typography variant="body1">Dark Mode</Typography>

            <Typography variant="body2" color="text.secondary">
              Use dark theme for the dashboard.
            </Typography>
          </Box>

          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(dispatch, !darkMode)}
          />
        </Box>
      </Box>

      <Divider />

      {/* Sidenav Colors */}
      <Box sx={{ py: 4 }}>
        <Typography
          variant="subtitle1"
          color="text.primary"
          sx={{ fontWeight: "bold" }}
        >
          Sidenav Colors
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, mb: 2 }}
        >
          Choose a color for your sidebar.
        </Typography>

        <Stack direction="row" spacing={1.5}>
          {Object.entries(sidenavColorMap).map(([name, color]) => {
            const selected = sidenavColor === name;

            return (
              <Box
                key={name}
                onClick={() => setSidenavColor(dispatch, name)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: color.main,

                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  border: "2px solid",
                  borderColor: selected ? "primary.main" : "transparent",

                  boxShadow: selected ? `0 0 0 2px ${color.main}40` : 1,

                  transition: "transform 180ms ease, box-shadow 180ms ease",

                  "&:hover": {
                    transform: "scale(1.1)",
                  },

                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
              >
                {selected && (
                  <CheckIcon
                    sx={{
                      fontSize: 17,
                      color: color.contrast,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Divider />

      {/* Sidenav Theme */}
      <Box sx={{ py: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Sidenav Theme
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, mb: 2 }}
        >
          Choose how the sidebar should look.
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant={sidenavTheme === "dark" ? "contained" : "outlined"}
            onClick={() => setSidenavTheme(dispatch, "dark")}
          >
            Dark
          </Button>

          <Button
            variant={sidenavTheme === "transparent" ? "contained" : "outlined"}
            onClick={() => setSidenavTheme(dispatch, "transparent")}
          >
            Transparent
          </Button>

          <Button
            variant={sidenavTheme === "white" ? "contained" : "outlined"}
            onClick={() => setSidenavTheme(dispatch, "white")}
          >
            White
          </Button>
        </Stack>
      </Box>

      <Divider />

      {/* Navbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Fixed Navbar
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Keep the navbar at the top.
          </Typography>
        </Box>

        <Switch
          checked={fixedNavbar}
          onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Mini Sidebar
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Collapse the sidebar to a smaller size.
          </Typography>
        </Box>

        <Switch
          checked={miniSidenav}
          onChange={() => setMiniSidenav(dispatch, !miniSidenav)}
        />
      </Box>
    </Drawer>
  );
}
