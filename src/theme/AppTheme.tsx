import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useMaterialController } from "@/context/useMaterialController";
import { lightTheme, darkTheme } from "./theme";

interface AppThemeProps {
  children: React.ReactNode;
}

export function AppTheme({ children }: AppThemeProps) {
  const [controller] = useMaterialController();

  const theme = controller.darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
