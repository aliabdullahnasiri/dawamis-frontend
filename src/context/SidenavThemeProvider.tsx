import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  sidenavThemes,
  type SidenavThemeName,
} from "@/constants/sidenav";

import { SidenavThemeContext } from "./SidenavThemeContext";

interface Props {
  children: ReactNode;
}

export function SidenavThemeProvider({ children }: Props) {
  const [themeName, setThemeName] =
    useState<SidenavThemeName>("dark");

  const value = useMemo(
    () => ({
      themeName,

      theme: sidenavThemes[themeName],

      setTheme: setThemeName,
    }),
    [themeName],
  );

  return (
    <SidenavThemeContext.Provider value={value}>
      {children}
    </SidenavThemeContext.Provider>
  );
}
