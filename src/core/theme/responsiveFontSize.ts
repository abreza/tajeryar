import { Theme } from "@mui/joy";

export const makeResponsiveFontSize = (theme: Theme) => {
  theme.typography = {
    ...theme.typography,
    h1: {
      ...theme.typography.h1,
      fontSize: "1.75rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "2rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2.25rem",
      },
    },
    h2: {
      ...theme.typography.h2,
      fontSize: "1.5rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.75rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.875rem",
      },
    },
    h3: {
      ...theme.typography.h3,
      fontSize: "1.2rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.35rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.5rem",
      },
    },
    h4: {
      ...theme.typography.h4,
      fontSize: "1rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.125rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.25rem",
      },
    },
    "title-lg": {
      ...theme.typography["title-lg"],
      fontSize: "1rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.0625rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.125rem",
      },
    },
    "title-md": {
      ...theme.typography["title-md"],
      fontSize: "0.875rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "0.9375rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1rem",
      },
    },
    "title-sm": {
      ...theme.typography["title-sm"],
      fontSize: "0.75rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "0.8125rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "0.875rem",
      },
    },
    "body-lg": {
      ...theme.typography["body-lg"],
      fontSize: "1rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.0625rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.125rem",
      },
    },
    "body-md": {
      ...theme.typography["body-md"],
      fontSize: "0.875rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "0.9375rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1rem",
      },
    },
    "body-sm": {
      ...theme.typography["body-sm"],
      fontSize: "0.75rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "0.8125rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "0.875rem",
      },
    },
    "body-xs": {
      ...theme.typography["body-xs"],
      fontSize: "0.625rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "0.6875rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "0.75rem",
      },
    },
  };
};
