// hooks/useSidenavTheme.ts

import { useMaterialController } from "@/context/useMaterialController";
import { sidenavThemes } from "@/constants/sidenav";
import type { SidenavThemeName } from "@/constants/sidenav";

export function useSidenavTheme() {
  const [controller, dispatch] = useMaterialController();

  const darkMode = controller.darkMode;

  const theme = sidenavThemes[controller.sidenavTheme](darkMode);

  const setTheme = (themeName: SidenavThemeName) => {
    dispatch({
      type: "SIDENAV_THEME",
      value: themeName,
    });
  };

  return {
    theme,
    themeName: controller.sidenavTheme,
    setTheme,
  };
}
