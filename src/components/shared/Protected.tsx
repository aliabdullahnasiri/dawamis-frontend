import { PermissionGate } from "@/components/shared/Contracts";
import { useSession } from "@/context/Session";
import type { ReactNode } from "react";

export function Protected({ permission, children }: { permission: string; children: ReactNode }) { const { context } = useSession(); return <PermissionGate grants={context?.permissions || []} permission={permission}>{children}</PermissionGate>; }
