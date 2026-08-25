import { useContext } from "react";

import { MaterialContext } from "./MaterialContext";

import type { MaterialState, MaterialAction } from "./materialReducer";

export type ContextValue = [MaterialState, React.Dispatch<MaterialAction>];

export function useMaterialController(): ContextValue {
  const context = useContext(MaterialContext);

  if (!context) {
    throw new Error(
      "useMaterialController must be used inside MaterialControllerProvider.",
    );
  }

  return context;
}
