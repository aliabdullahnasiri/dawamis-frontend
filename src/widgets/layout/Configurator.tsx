import LocaleControl from "@/components/shared/LocaleControl";
import { useLocale } from "@/i18n/locale";
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
  const { t } = useLocale();
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
            {t("settings")}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("customize")}
          </Typography>
        </Box>

        <IconButton aria-label={t("close")} onClick={() => setOpenConfigurator(dispatch, false)}>
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
          {t("appearance")}
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
            <Typography variant="body1">{t("darkMode")}</Typography>

            <Typography variant="body2" color="text.secondary">
              {t("darkHelp")}
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
          {t("colors")}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, mb: 2 }}
        >
          {t("colorHelp")}
        </Typography>

        <Stack direction="row" spacing={1.5}>
          {Object.entries(sidenavColorMap).map(([name, color]) => {
            const selected = sidenavColor === name;

            return (
              <Box component="button" type="button" aria-label={name} aria-pressed={selected}
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
          {t("sideTheme")}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, mb: 2 }}
        >
          {t("sideHelp")}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant={sidenavTheme === "dark" ? "contained" : "outlined"}
            onClick={() => setSidenavTheme(dispatch, "dark")}
          >
            {t("dark")}
          </Button>

          <Button
            variant={sidenavTheme === "transparent" ? "contained" : "outlined"}
            onClick={() => setSidenavTheme(dispatch, "transparent")}
          >
            {t("transparent")}
          </Button>

          <Button
            variant={sidenavTheme === "white" ? "contained" : "outlined"}
            onClick={() => setSidenavTheme(dispatch, "white")}
          >
            {t("white")}
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ py: 3 }}><LocaleControl /></Box>

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
            {t("fixed")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("fixedHelp")}
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
            {t("mini")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("miniHelp")}
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
