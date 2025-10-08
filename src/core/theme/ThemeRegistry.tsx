"use client";

import { useState, useEffect, JSX } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { CssVarsProvider, THEME_ID } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { theme } from "@/core/theme/theme";
import { createRtlCache } from "@/core/theme/createCache";
// eslint-disable-next-line no-restricted-imports
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from "@mui/material/styles";

export default function ThemeRegistry({ children }: { children: JSX.Element }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createRtlCache();
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const staticMode = "light";

  const [storedMode, setStoredMode] = useState<"light" | "dark" | "system">(
    staticMode
  );

  useEffect(() => {
    if (mounted) {
      const savedMode = localStorage.getItem("joy-mode") as
        | "light"
        | "dark"
        | "system"
        | null;

      if (savedMode) {
        setStoredMode(savedMode);
      } else {
        const isDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setStoredMode(isDarkMode ? "dark" : "light");
      }
    }
  }, [mounted]);

  return (
    <CacheProvider value={cache}>
      <MaterialCssVarsProvider defaultMode={staticMode}>
        <CssVarsProvider
          theme={{ [THEME_ID]: theme }}
          modeStorageKey="joy-mode"
          colorSchemeStorageKey="joy-color-scheme"
          disableNestedContext
        >
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  document.documentElement.setAttribute('data-joy-color-scheme', '${staticMode}');
                })();
              `,
            }}
          />

          {mounted && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    document.documentElement.setAttribute('data-joy-color-scheme', '${storedMode}');
                  })();
                `,
              }}
            />
          )}

          <CssBaseline />
          {children}
        </CssVarsProvider>
      </MaterialCssVarsProvider>
    </CacheProvider>
  );
}
