import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { MaterialControllerProvider } from "./context/MaterialProvider";
import "./index.css";
import { AppTheme } from "./theme/AppTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MaterialControllerProvider>
        <AppTheme>
          <App />
        </AppTheme>
      </MaterialControllerProvider>
    </BrowserRouter>
  </StrictMode>,
);
