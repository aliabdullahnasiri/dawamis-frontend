import { createContext } from "react";
import type {
  SidenavTheme,
  SidenavThemeName,
} from "@/constants/sidenav";

interface SidenavThemeContextValue {
  themeName: SidenavThemeName;
  theme: SidenavTheme;
  setTheme: (theme: SidenavThemeName) => void;
}

export const SidenavThemeContext =
  createContext<SidenavThemeContextValue | null>(null);
