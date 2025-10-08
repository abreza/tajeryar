import { Theme as JoyTheme } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface ColorPalettePropOverrides {
    editor: true;
  }

  interface Palette {
    editor: {
      codeBackground: string;
      codeBorder: string;
      highlightBackground: string;
      highlightBorder: string;
      selectionBackground: string;
      selectionBorder: string;
    };
  }
}

declare module "@mui/joy/styles" {
  interface Components {
    JoyEditor?: {
      defaultProps?: Record<string, any>;
      styleOverrides?: {
        root?: (props: { theme: JoyTheme }) => Record<string, any>;
      };
    };
    JoyCodeBlock?: {
      defaultProps?: Record<string, any>;
      styleOverrides?: {
        root?: (props: { theme: JoyTheme }) => Record<string, any>;
      };
    };
    JoyLatex?: {
      defaultProps?: Record<string, any>;
      styleOverrides?: {
        root?: (props: { theme: JoyTheme }) => Record<string, any>;
      };
    };
    JoyMedia?: {
      defaultProps?: Record<string, any>;
      styleOverrides?: {
        root?: (props: { theme: JoyTheme }) => Record<string, any>;
      };
    };
  }
}
