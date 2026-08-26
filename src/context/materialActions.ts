import type {

  MaterialAction,
} from "./materialReducer";
import {} from "@/context/useSidenavTheme"

type Dispatch = React.Dispatch<MaterialAction>;

export const setOpenSidenav = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "OPEN_SIDENAV",
    value,
  });
};

export const setMiniSidenav = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "MINI_SIDENAV",
    value,
  });
};

export const setSidenavHovered = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "SIDENAV_HOVERED",
    value,
  });
};

export const setSidenavTheme= (
  dispatch: Dispatch,
  value: string,
) => {
  dispatch({
    type: "SIDENAV_THEME",
    value,
  });
};

export const setSidenavColor = (
  dispatch: Dispatch,
  value: string,
) => {
  dispatch({
    type: "SIDENAV_COLOR",
    value,
  });
};

export const setTransparentNavbar = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "TRANSPARENT_NAVBAR",
    value,
  });
};

export const setFixedNavbar = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "FIXED_NAVBAR",
    value,
  });
};

export const setOpenConfigurator = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "OPEN_CONFIGURATOR",
    value,
  });
};

export const setDarkMode = (
  dispatch: Dispatch,
  value: boolean,
) => {
  dispatch({
    type: "DARK_MODE",
    value,
  });
};
