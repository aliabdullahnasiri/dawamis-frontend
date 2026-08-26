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

export const sidenavThemes = {
  dark: () => ({
    background: "#1e1e1e",
    backgroundDark: "#171717",

    text: "#ffffff",
    textSecondary: "#a3a3a3",

    activeText: "#ffffff",
    activeBackground: "#256ae0",

    divider: "rgba(255, 255, 255, 0.10)",
  }),

  white: () => ({
    background: "#ffffff",
    backgroundDark: "#e5e5e5",

    text: "#111827",
    textSecondary: "#64748b",

    activeText: "#ffffff",
    activeBackground: "#256ae0",

    divider: "rgba(15, 23, 42, 0.10)",
  }),

  transparent: (darkMode: boolean) => ({
    background: "transparent",
    backgroundDark: "transparent",

    text: darkMode ? "#ffffff" : "#111827",
    textSecondary: darkMode ? "#a3a3a3" : "#64748b",

    activeText: "#ffffff",
    activeBackground: "#256ae0",

    divider: darkMode ? "rgba(255, 255, 255, 0.10)" : "rgba(15, 23, 42, 0.10)",
  }),
} as const;

export type SidenavThemeName = keyof typeof sidenavThemes;
export type SidenavTheme = (typeof sidenavThemes)[SidenavThemeName];
