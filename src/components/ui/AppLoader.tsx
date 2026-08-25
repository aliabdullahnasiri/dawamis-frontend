import { Box, CircularProgress } from "@mui/material";

export default function AppLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "background.default",

        zIndex: 9999,
      }}
    >
      <CircularProgress size={84} thickness={10} color="primary" />
    </Box>
  );
}
