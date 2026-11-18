import {
  createTheme,
  type ThemeOptions,
  type Theme,
} from "@mui/material/styles";

const common: ThemeOptions = {
  transitions: {
    duration: { shortest: 120, shorter: 160, short: 180, standard: 220, complex: 260, enteringScreen: 240, leavingScreen: 160 },
    easing: { easeInOut: 'cubic-bezier(.2, 0, 0, 1)', easeOut: 'cubic-bezier(.16, 1, .3, 1)', easeIn: 'cubic-bezier(.4, 0, 1, 1)', sharp: 'cubic-bezier(.4, 0, .6, 1)' },
  },
  typography: {
    fontFamily:
      '"Public Sans", "Noto Sans Arabic", "Vazirmatn", sans-serif',

    h1: {
      fontSize: "2.25rem",
      lineHeight: 1.35,
      fontWeight: 700,
    },

    h2: {
      fontSize: "1.875rem",
      lineHeight: 1.35,
      fontWeight: 700,
    },

    h3: {
      fontSize: "1.625rem",
      lineHeight: 1.35,
      fontWeight: 700,
    },

    h4: {
      fontSize: "1.5rem",
      lineHeight: 1.35,
      fontWeight: 700,
    },

    h5: {
      fontSize: "1.25rem",
      lineHeight: 1.35,
      fontWeight: 600,
    },

    h6: {
      fontSize: "1.125rem",
      lineHeight: 1.35,
      fontWeight: 600,
    },

    body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
    body2: { fontSize: "0.8125rem", lineHeight: 1.6 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiDialog: {
      defaultProps: { transitionDuration: { enter: 220, exit: 160 } },
      styleOverrides: { paper: { overflow: "hidden", animation: "dialog-reveal 220ms cubic-bezier(.2, 0, 0, 1)" } },
    },
    MuiMenu: { defaultProps: { transitionDuration: { enter: 180, exit: 140 } } },
    MuiPopover: { defaultProps: { transitionDuration: { enter: 180, exit: 140 } } },
    MuiSkeleton: { defaultProps: { animation: 'wave' } },
    MuiAlert: { styleOverrides: { root: { animation: 'feedback-reveal 180ms cubic-bezier(.2, 0, 0, 1)' } } },
    MuiListItemButton: { styleOverrides: { root: { transition: 'background-color 160ms ease, color 120ms ease' } } },
    MuiAccordionSummary: { styleOverrides: { expandIconWrapper: { transition: 'transform 180ms cubic-bezier(.2, 0, 0, 1)' } } },
    MuiFormLabel: {
      styleOverrides: { asterisk: { display: "none" } },
    },
    MuiFormControlLabel: {
      styleOverrides: { asterisk: { display: "none" } },
    },
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
          "&.Mui-checked .MuiSvgIcon-root": { animation: "check-confirm 160ms cubic-bezier(.2, 0, 0, 1)" },

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
          animation: "feedback-reveal 160ms ease",
          fontSize: "0.75rem",
        },
      },
    },


    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "9px 16px",
          transition: "transform 120ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
          "&:active:not(.Mui-disabled)": { transform: "scale(.96)" },
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
          transition: "transform 120ms ease, background-color 160ms ease, color 160ms ease",
          "&:active:not(.Mui-disabled)": { transform: "scale(.96)" },
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          backgroundImage: "none",
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "none",
        }),
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
