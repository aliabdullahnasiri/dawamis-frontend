import { useMemo, useReducer, type ReactNode } from "react";

import { getStoredBoolean, getStoredString } from "@/utils/storage";
import { MaterialContext } from "./MaterialContext";
import {
    reducer,
    type MaterialAction,
    type MaterialState,
} from "./materialReducer";

interface MaterialProviderProps {
  children: ReactNode;
}

const initialState: MaterialState = {
  // Temporary UI state
  openSidenav: true,
  sidenavHovered: false,
  openConfigurator: false,

  // Persistent UI state
  miniSidenav: getStoredBoolean("miniSidenav", false),

  sidenavColor: getStoredString(
    "sidenavColor",
    "dark",
  ) as MaterialState["sidenavColor"],

  darkMode: getStoredBoolean("darkMode", false),

  sidenavType: getStoredString(
    "sidenavType",
    "white",
  ) as MaterialState["sidenavType"],

  transparentNavbar: getStoredBoolean("transparentNavbar", true),

  fixedNavbar: getStoredBoolean("fixedNavbar", false),

  // Derived state
  isMini: false,
};

export function MaterialControllerProvider({
  children,
}: MaterialProviderProps) {
  const [controller, dispatch] = useReducer(reducer, initialState);
  const isMini = controller.miniSidenav && !controller.sidenavHovered;

  const value = useMemo(
    () =>
      [
        {
          ...controller,
          isMini,
        },
        dispatch,
      ] as [MaterialState, React.Dispatch<MaterialAction>],
    [controller, isMini],
  );

  return (
    <MaterialContext.Provider value={value}>
      {children}
    </MaterialContext.Provider>
  );
}
