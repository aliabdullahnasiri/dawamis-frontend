import {
  DashboardRounded,
  TableViewRounded,
  ReceiptLongRounded,
  PersonRounded,
  ViewInArRounded,
  NotificationsRounded,
  SettingsRounded,
} from "@mui/icons-material";

export interface RouteItem {
  label: string;
  path?: string;
  icon: React.ElementType;
  permission?: string;
  children?: RouteItem[];
  element?: React.ReactNode;
}

export interface RouteGroup {
  title?: string;
  layout: "dashboard" | "auth";
  pages: RouteItem[];
}

export const routes: RouteGroup[] = [
  {
    layout: "dashboard",

    pages: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: DashboardRounded,
        permission: "dashboard.view",
        element: <p>Dashboard</p>,
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
            element: <p>Medicines</p>,
          },
          {
            label: "Stock",
            path: "/stock",
            icon: TableViewRounded,
            permission: "stock.read",
            element: <p>Stock</p>,
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
            element: <p>Invoices</p>,
          },
          {
            label: "Returns",
            path: "/sales/returns",
            icon: ReceiptLongRounded,
            permission: "sale_return.read",
            element: <p>Sales Returns</p>,
          },
        ],
      },

      {
        label: "Purchases",
        icon: ReceiptLongRounded,

        children: [
          {
            label: "Purchases",
            path: "/purchases",
            icon: ReceiptLongRounded,
            permission: "purchase.read",
            element: <p>Purchases</p>,
          },
          {
            label: "Purchase Returns",
            path: "/purchases/returns",
            icon: ReceiptLongRounded,
            permission: "purchase_return.read",
            element: <p>Purchase Returns</p>,
          },
        ],
      },

      {
        label: "Customers",
        path: "/customers",
        icon: PersonRounded,
        permission: "customer.read",
        element: <p>Customers</p>,
      },

      {
        label: "Suppliers",
        path: "/suppliers",
        icon: ViewInArRounded,
        permission: "supplier.read",
        element: <p>Suppliers</p>,
      },

      {
        label: "Notifications",
        path: "/notifications",
        icon: NotificationsRounded,
        permission: "notification.read",
        element: <p>Notifications</p>,
      },

      {
        label: "Settings",
        path: "/settings",
        icon: SettingsRounded,
        permission: "settings.read",
        element: <p>Settings</p>,
      },
    ],
  },

  {
    title: "Account",
    layout: "dashboard",

    pages: [
      {
        label: "Profile",
        path: "/profile",
        icon: PersonRounded,
        element: <p>Profile</p>,
      },
    ],
  },

  {
    title: "Authentication",
    layout: "auth",

    pages: [
      {
        label: "Login",
        path: "/auth/login",
        icon: PersonRounded,
        element: <p>Login</p>,
      },
      {
        label: "Register",
        path: "/auth/register",
        icon: PersonRounded,
        element: <p>Register</p>,
      },
    ],
  },
];

export default routes;
