import {
  createTheme,
  type ThemeOptions,
  type Theme,
} from "@mui/material/styles";

const common: ThemeOptions = {
  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },

      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "transparent",

          transition:
            "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            borderWidth: 1,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "text.secondary",
          },

          "&.Mui-focused": {
            backgroundColor: "background.paper",

            boxShadow: (theme: Theme) =>
              `0 0 0 3px ${theme.palette.primary.main}20`,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
            borderWidth: 1,
          },

          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "error.main",
          },

          "&.Mui-disabled": {
            backgroundColor: "action.disabledBackground",
          },
        },

        input: {
          padding: "13px 14px",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "text.secondary",

          "&.Mui-focused": {
            color: "primary.main",
          },

          "&.Mui-error": {
            color: "error.main",
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "13px 14px",
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 6,

          "&:hover": {
            backgroundColor: "action.hover",
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "action.hover",
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },

        switchBase: {
          padding: 3,

          "&.Mui-checked": {
            transform: "translateX(16px)",
          },
        },

        thumb: {
          width: 20,
          height: 20,
        },

        track: {
          borderRadius: 20,
          opacity: 1,
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 2,
          marginTop: 6,
          fontSize: "0.75rem",
        },
      },
    },


    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "9px 16px",
          boxShadow: "none",

          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },


    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "none",
          border: "1px solid",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.75rem",
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...common,

  palette: {
    mode: "light",

    primary: {
      main: "#256ae0",
    },

    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },

    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },

    divider: "#e2e8f0",
  },
});


export const darkTheme = createTheme({
  ...common,

  palette: {
    mode: "dark",

    primary: {
      main: "#60a5ff",
    },

    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },

    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },

    divider: "#1e293b",
  },
});
