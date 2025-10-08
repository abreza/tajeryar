"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

const ThemeController = dynamic(() => import("./ThemeController"), {
  ssr: false,
});

export default function ThemeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <ThemeController />
    </>
  );
}
