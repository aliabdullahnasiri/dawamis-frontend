import type { SidenavThemeName } from "@/constants/sidenav";

export interface MaterialState {
  openSidenav: boolean;
  miniSidenav: boolean;
  isMini: boolean;
  sidenavHovered: boolean;
  sidenavColor: string;
  darkMode: boolean;
  sidenavTheme: SidenavThemeName;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

export type MaterialAction =
  | {
      type: "OPEN_SIDENAV";
      value: boolean;
    }
  | {
      type: "MINI_SIDENAV";
      value: boolean;
    }
  | {
      type: "SIDENAV_HOVERED";
      value: boolean;
    }
  | {
      type: "SIDENAV_THEME";
      value: string;
    }
  | {
      type: "SIDENAV_COLOR";
      value: string;
    }
  | {
      type: "DARK_MODE";
      value: boolean;
    }
  | {
      type: "TRANSPARENT_NAVBAR";
      value: boolean;
    }
  | {
      type: "FIXED_NAVBAR";
      value: boolean;
    }
  | {
      type: "OPEN_CONFIGURATOR";
      value: boolean;
    };

export function reducer(
  state: MaterialState,
  action: MaterialAction,
): MaterialState {
  switch (action.type) {
    case "OPEN_SIDENAV":
      return {
        ...state,
        openSidenav: action.value,
      };

    case "MINI_SIDENAV":
      localStorage.setItem("miniSidenav", String(action.value));

      return {
        ...state,
        miniSidenav: action.value,
      };

    case "SIDENAV_HOVERED":
      // Temporary state — don't save it
      return {
        ...state,
        sidenavHovered: action.value,
      };

    case "SIDENAV_THEME":
      localStorage.setItem("sidenavTheme", action.value);

      return {
        ...state,
        sidenavTheme: action.value,
      };

    case "SIDENAV_COLOR":
      localStorage.setItem("sidenavColor", action.value);

      return {
        ...state,
        sidenavColor: action.value,
      };

    case "TRANSPARENT_NAVBAR":
      localStorage.setItem("transparentNavbar", String(action.value));

      return {
        ...state,
        transparentNavbar: action.value,
      };

    case "FIXED_NAVBAR":
      localStorage.setItem("fixedNavbar", String(action.value));

      return {
        ...state,
        fixedNavbar: action.value,
      };

    case "OPEN_CONFIGURATOR":
      // Temporary state — don't save it
      return {
        ...state,
        openConfigurator: action.value,
      };

    case "DARK_MODE":
      localStorage.setItem("darkMode", String(action.value));

      return {
        ...state,
        darkMode: action.value,
      };

    default:
      return state;
  }
}
