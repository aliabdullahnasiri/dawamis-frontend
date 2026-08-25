import { createContext } from "react";

import type { ContextValue } from "./useMaterialController";

export const MaterialContext = createContext<ContextValue | null>(null);

MaterialContext.displayName = "MaterialContext";
