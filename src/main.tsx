import { SessionProvider } from "./context/Session";
import { LocaleProvider } from "./i18n/locale";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { SidenavThemeProvider } from "@/context/SidenavThemeProvider";
import App from "./App.tsx";
import { MaterialControllerProvider } from "./context/MaterialProvider";
import "./index.css";
import "./theme/motion.css";
import Scrollbars from "./components/shared/Scrollbars";
import { AppTheme } from "./theme/AppTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider><BrowserRouter>
      <MaterialControllerProvider>
        <AppTheme>
          <Scrollbars/>
          <SidenavThemeProvider>
            <SessionProvider><App /></SessionProvider>
          </SidenavThemeProvider>
        </AppTheme>
      </MaterialControllerProvider>
    </BrowserRouter></LocaleProvider>
  </StrictMode>,
);
