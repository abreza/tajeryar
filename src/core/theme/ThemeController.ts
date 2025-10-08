"use client";

import { useEffect, useState } from "react";
import { useColorScheme } from "@mui/joy/styles";
// eslint-disable-next-line no-restricted-imports
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

export default function ThemeController() {
  const { setMode: setJoyMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const savedMode = localStorage.getItem("joy-mode") as
      | "light"
      | "dark"
      | "system"
      | null;

    if (savedMode) {
      setJoyMode(savedMode);
      setMaterialMode(savedMode);
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const mode = prefersDark ? "dark" : "light";
      setJoyMode(mode);
      setMaterialMode(mode);

      localStorage.setItem("joy-mode", mode);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("joy-mode") === "system") {
        const newMode = e.matches ? "dark" : "light";
        setJoyMode(newMode);
        setMaterialMode(newMode);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener?.(handleChange);
    return () => mediaQuery.removeListener?.(handleChange);
  }, [mounted, setJoyMode, setMaterialMode]);

  return null;
}
