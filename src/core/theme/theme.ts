import { extendTheme } from "@mui/joy/styles";
import type { Theme, ThemeVars } from "@mui/joy/styles";
import { makeResponsiveFontSize } from "./responsiveFontSize";

const createTransition = (
  properties: string[],
  options: { duration?: number; easing?: string } = {}
) => {
  const { duration = 300, easing = "cubic-bezier(0.4, 0, 0.2, 1)" } = options;
  return properties.map((prop) => `${prop} ${duration}ms ${easing}`).join(", ");
};

export const theme = extendTheme({
  fontFamily: {
    body: "var(--iransansxv)",
    display: "var(--iransansxv)",
    code: "var(--iransansxv)",
    fallback: "var(--iransansxv)",
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#e2f5fd",
          100: "#b6e4fa",
          200: "#87d2f6",
          300: "#5dc0f0",
          400: "#45b3ee",
          500: "#38a6ea",
          600: "#3498db",
          700: "#2f85c7",
          800: "#2b75b3",
          900: "#235590",
        },
        background: {
          surface: "white",
          level1: "#f7f7f7",
          level2: "#f0f0f0",
        },
        editor: {
          codeBackground: "#f5f5f5",
          codeBorder: "#e0e0e0",
          highlightBackground: "rgba(255, 213, 0, 0.4)",
          highlightBorder: "rgba(255, 213, 0, 0.8)",
          selectionBackground: "rgba(255, 165, 0, 0.4)",
          selectionBorder: "rgba(255, 165, 0, 0.8)",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: "#1a2733",
          100: "#203547",
          200: "#26445c",
          300: "#2c5270",
          400: "#326184",
          500: "#386f98",
          600: "#3e7eac",
          700: "#448cc0",
          800: "#4a9ad4",
          900: "#50a8e8",
        },
        background: {
          surface: "#121212",
          level1: "#181818",
          level2: "#222222",
        },
        editor: {
          codeBackground: "#2d2d2d",
          codeBorder: "#444444",
          highlightBackground: "rgba(255, 213, 0, 0.3)",
          highlightBorder: "rgba(255, 213, 0, 0.6)",
          selectionBackground: "rgba(255, 165, 0, 0.3)",
          selectionBorder: "rgba(255, 165, 0, 0.6)",
        },
      },
    },
  },

  components: {
    JoyChip: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
          const p = (theme.vars as ThemeVars).palette;
          return {
            transition: createTransition([
              "background-color",
              "color",
              "box-shadow",
              "transform",
            ]),
            "&:hover": { transform: "translateY(-1px)" },

            // SOFT + PRIMARY — high contrast (light/dark)
            '&[data-variant="soft"][data-color="primary"]': {
              backgroundColor: p.primary[100],
              color: p.primary[800],
              "&:hover": { backgroundColor: p.primary[200] },
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: p.primary[400],
                color: p.common.white,
                "&:hover": { backgroundColor: p.primary[500] },
              },
            },

            // SOLID + PRIMARY — always white text
            '&[data-variant="solid"][data-color="primary"]': {
              backgroundColor: p.primary[600],
              color: p.common.white,
              "&:hover": { backgroundColor: p.primary[700] },
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: p.primary[700],
                color: p.common.white,
                "&:hover": { backgroundColor: p.primary[800] },
              },
            },
          };
        },
      },
    },

    JoyButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
          const p = (theme.vars as ThemeVars).palette;
          return {
            transition: createTransition([
              "background-color",
              "color",
              "box-shadow",
              "transform",
            ]),
            "&:hover": { transform: "translateY(-2px)", boxShadow: "sm" },
            "&:active": { transform: "translateY(0)", boxShadow: "md" },

            // SOFT + PRIMARY
            '&[data-variant="soft"][data-color="primary"]': {
              backgroundColor: p.primary[100],
              color: p.primary[800],
              "&:hover": { backgroundColor: p.primary[200] },
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: p.primary[400],
                color: p.common.white,
                "&:hover": { backgroundColor: p.primary[500] },
              },
            },

            // SOLID + PRIMARY
            '&[data-variant="solid"][data-color="primary"]': {
              backgroundColor: p.primary[600],
              color: p.common.white,
              "&:hover": { backgroundColor: p.primary[700] },
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: p.primary[700],
                color: p.common.white,
                "&:hover": { backgroundColor: p.primary[800] },
              },
            },

            // OUTLINED + PRIMARY (ensure focus/hover are legible)
            '&[data-variant="outlined"][data-color="primary"]': {
              color: p.primary[700],
              borderColor: p.primary[300],
              "&:hover": { backgroundColor: p.primary[50] },
              [theme.getColorSchemeSelector("dark")]: {
                color: p.primary[900],
                borderColor: p.primary[600],
                "&:hover": { backgroundColor: p.primary[200] },
              },
            },
          };
        },
      },
    },

    JoyIconButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
          const p = (theme.vars as ThemeVars).palette;
          return {
            transition: createTransition([
              "background-color",
              "color",
              "box-shadow",
              "transform",
            ]),
            '&[data-variant="soft"][data-color="primary"]': {
              backgroundColor: p.primary[100],
              color: p.primary[800],
              "&:hover": { backgroundColor: p.primary[200] },
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: p.primary[400],
                color: p.common.white,
                "&:hover": { backgroundColor: p.primary[500] },
              },
            },
          };
        },
      },
    },

    JoyInput: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
          const p = (theme.vars as ThemeVars).palette;
          return {
            transition: createTransition(["border-color", "box-shadow"]),
            "&:focus-within": {
              // scheme-aware focus ring
              boxShadow: `0 0 0 2px ${p.primary[200]}`,
              [theme.getColorSchemeSelector("dark")]: {
                boxShadow: `0 0 0 2px ${p.primary[500]}`,
              },
            },
          };
        },
      },
    },

    JoyCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          transition: createTransition([
            "box-shadow",
            "transform",
            "background-color",
            "color",
          ]),
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "xs",
          },
          [theme.getColorSchemeSelector("dark")]: {},
        }),
      },
    },
  },
});

makeResponsiveFontSize(theme);
export default theme;
