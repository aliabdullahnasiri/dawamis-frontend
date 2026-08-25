import {
  DashboardRounded,
  PersonRounded,
  ReceiptLongRounded,
  SettingsRounded,
  TableViewRounded,
} from "@mui/icons-material";

import { type NavItemProps } from "@/components/NavItem";

export const navigation: NavItemProps[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardRounded,
  },

  {
    label: "Inventory",
    icon: TableViewRounded,
    children: [
      {
        label: "Medicines",
        path: "/medicines",
        icon: TableViewRounded,
        permission: "medicine.read",
      },
      {
        label: "Stock",
        path: "/stock",
        icon: TableViewRounded,
        permission: "stock.read",
      },
    ],
  },

  {
    label: "Sales",
    icon: ReceiptLongRounded,
    children: [
      {
        label: "Invoices",
        path: "/sales/invoices",
        icon: ReceiptLongRounded,
        permission: "sale.read",
      },
      {
        label: "Returns",
        path: "/sales/returns",
        icon: ReceiptLongRounded,
        permission: "sale_return.read",
      },
    ],
  },

  {
    label: "Customers",
    path: "/customers",
    icon: PersonRounded,
    permission: "customer.read",
  },

  {
    label: "Settings",
    path: "/settings",
    icon: SettingsRounded,
    permission: "settings.read",
  },
];

export const sidenavColorMap: Record<
  string,
  { main: string; dark: string; contrast: string }
> = {
  white: {
    main: "#FFFFFF",
    dark: "#E5E5E5",
    contrast: "#111111",
  },

  dark: {
    main: "#424242",
    dark: "#171717",
    contrast: "#FFFFFF",
  },

  green: {
    main: "#66BB6A",
    dark: "#2E7D32",
    contrast: "#FFFFFF",
  },

  orange: {
    main: "#FFA726",
    dark: "#EF6C00",
    contrast: "#FFFFFF",
  },

  red: {
    main: "#EF5350",
    dark: "#C62828",
    contrast: "#FFFFFF",
  },

  pink: {
    main: "#EC407A",
    dark: "#AD1457",
    contrast: "#FFFFFF",
  },
};
